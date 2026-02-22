CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The 'users' table has been removed as Clerk is our single source of truth for user profiles.
-- User IDs are now stored as TEXT to match Clerk's IDs (e.g. user_...).

CREATE TABLE courses(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT, -- eg. N5, N4, diploma
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    topics JSONB NOT NULL,    -- array of strings for lesson topics ["ますけい", "に particle", "Days of the week"]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, lesson_number)
);

CREATE TABLE about_lessons(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE goi(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    content JSONB NOT NULL,     -- [[word, reading, meaning], [word, reading, meaning]]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bunkei(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    patterns JSONB NOT NULL,    -- ["pattern1", "pattern2", "pattern3"]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reibun(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    sentences JSONB NOT NULL,   -- ["sentence1", "sentence2", "sentence3"]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE renshuu_a(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    exercises JSONB NOT NULL,   -- ["exercise1","exercise2","exercise3"]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE renshuu_b(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE renshuu_b_parts(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    renshuu_b_id UUID NOT NULL REFERENCES renshuu_b(id) ON DELETE CASCADE,
    part_number INTEGER NOT NULL,
    image_url TEXT,     -- optional
    rei JSONB NOT NULL,  -- example
    questions JSONB NOT NULL,
    correct_answers JSONB NOT NULL,   -- correct answer
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(renshuu_b_id, part_number)
);

CREATE TABLE renshuu_c(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE renshuu_c_parts(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    renshuu_c_id UUID NOT NULL REFERENCES renshuu_c(id) ON DELETE CASCADE,
    part_number INTEGER NOT NULL,
    rei JSONB NOT NULL,  -- example
    image_url TEXT NOT NULL,    -- context image
    question_image_urls JSONB NOT NULL,   -- question image
    correct_answers JSONB NOT NULL, -- correct answers
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(renshuu_c_id, part_number)
);

CREATE TABLE mondai(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mondai_parts(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mondai_id UUID NOT NULL REFERENCES mondai(id) ON DELETE CASCADE,
    part_number INTEGER NOT NULL,
    audio_url TEXT, -- audio OR text, one of them required
    text_content TEXT,  -- audio OR text, one of them required
    rei TEXT NOT NULL,  -- example
    questions JSONB NOT NULL,
    correct_answers JSONB NOT NULL,   -- correct answer
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mondai_id, part_number),
    CHECK(audio_url IS NOT NULL OR text_content IS NOT NULL)
);

CREATE TABLE kaiwa(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
    heading TEXT NOT NULL,
    dialogue JSONB NOT NULL,    -- ["line1", "line2", "line3"]
    image_url TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ================ USER PROGRESS ================

-- Track which courses a user has attempted
CREATE TABLE user_course_attempts(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    org_id TEXT NOT NULL,
    UNIQUE(user_id, course_id, org_id)
);

-- Track lesson progress
CREATE TABLE user_lesson_progress(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,

    -- Track completion of each section
    renshuu_b_completed BOOLEAN DEFAULT FALSE,
    renshuu_c_completed BOOLEAN DEFAULT FALSE,
    mondai_completed BOOLEAN DEFAULT FALSE,
    kaiwa_completed BOOLEAN DEFAULT FALSE,
    
    org_id TEXT NOT NULL,
    UNIQUE(user_id, lesson_id, org_id)
);

-- Store user answers for exercises
CREATE TABLE user_exercise_progress(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- 'renshuu a','renshuu b','renshuu c','mondai'
    part_id UUID,   -- reference to specific part if applicable
    question_index INTEGER,  -- for array based sections
    answer TEXT NOT NULL,
    is_correct BOOLEAN,
    org_id TEXT NOT NULL,
    answered_at TIMESTAMPTZ DEFAULT NOW() 
);

CREATE TABLE user_course_progress(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    org_id TEXT NOT NULL,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id, org_id)
);

-- ================ LAST ACCESSED TRACKING ================

CREATE TABLE user_last_accessed(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    course_number INTEGER NOT NULL,
    lesson_number INTEGER NOT NULL,
    org_id TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, org_id)
);

-- ==================== INDEXES ====================
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_user_course_attempts_user_id ON user_course_attempts(user_id);
CREATE INDEX idx_user_course_attempts_course_id ON user_course_attempts(course_id);
CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX idx_user_exercise_progress_user_lesson ON user_exercise_progress(user_id, lesson_id);
CREATE INDEX idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX idx_user_last_accessed_user_id ON user_last_accessed(user_id);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE goi ENABLE ROW LEVEL SECURITY;
ALTER TABLE bunkei ENABLE ROW LEVEL SECURITY;
ALTER TABLE reibun ENABLE ROW LEVEL SECURITY;
ALTER TABLE renshuu_a ENABLE ROW LEVEL SECURITY;
ALTER TABLE renshuu_b ENABLE ROW LEVEL SECURITY;
ALTER TABLE renshuu_b_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE renshuu_c ENABLE ROW LEVEL SECURITY;
ALTER TABLE renshuu_c_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mondai ENABLE ROW LEVEL SECURITY;
ALTER TABLE mondai_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE kaiwa ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_last_accessed ENABLE ROW LEVEL SECURITY;

-- Everyone can read courses and lessons
CREATE POLICY "Courses are viewable by everyone" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Lessons are viewable by everyone" ON lessons
    FOR SELECT USING (true);

-- Content tables are viewable by everyone
CREATE POLICY "About lessons are viewable by everyone" ON about_lessons
    FOR SELECT USING (true);

CREATE POLICY "Goi are viewable by everyone" ON goi
    FOR SELECT USING (true);

CREATE POLICY "Bunkei are viewable by everyone" ON bunkei
    FOR SELECT USING (true);

CREATE POLICY "Reibun are viewable by everyone" ON reibun
    FOR SELECT USING (true);

CREATE POLICY "Renshuu A are viewable by everyone" ON renshuu_a
    FOR SELECT USING (true);

CREATE POLICY "Renshuu B are viewable by everyone" ON renshuu_b
    FOR SELECT USING (true);

CREATE POLICY "Renshuu B parts are viewable by everyone" ON renshuu_b_parts
    FOR SELECT USING (true);

CREATE POLICY "Renshuu C are viewable by everyone" ON renshuu_c
    FOR SELECT USING (true);

CREATE POLICY "Renshuu C parts are viewable by everyone" ON renshuu_c_parts
    FOR SELECT USING (true);

CREATE POLICY "Mondai are viewable by everyone" ON mondai
    FOR SELECT USING (true);

CREATE POLICY "Mondai parts are viewable by everyone" ON mondai_parts
    FOR SELECT USING (true);

CREATE POLICY "Kaiwa are viewable by everyone" ON kaiwa
    FOR SELECT USING (true);

-- Users can manage their own progress
CREATE POLICY "Users can view own course attempts" ON user_course_attempts
    FOR SELECT USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Users can insert own course attempts" ON user_course_attempts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own course attempts" ON user_course_attempts
    FOR UPDATE USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Users can view own lesson progress" ON user_lesson_progress
    FOR SELECT USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Users can insert own lesson progress" ON user_lesson_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own lesson progress" ON user_lesson_progress
    FOR UPDATE USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Users can view own answers" ON user_exercise_progress
    FOR SELECT USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Users can insert own answers" ON user_exercise_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view own course progress" ON user_course_progress
    FOR SELECT USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Users can insert own course progress" ON user_course_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own course progress" ON user_course_progress
    FOR UPDATE USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Users can view own last accessed" ON user_last_accessed
    FOR SELECT USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Users can insert own last accessed" ON user_last_accessed
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own last accessed" ON user_last_accessed
    FOR UPDATE USING (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));