-- Create org_quizzes table
CREATE TABLE org_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id TEXT NOT NULL,
    created_by TEXT NOT NULL,
    lesson_ids UUID[] NOT NULL,
    questions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create org_quiz_attempts table
CREATE TABLE org_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES org_quizzes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    org_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    results JSONB NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing
CREATE INDEX idx_org_quizzes_org_id ON org_quizzes(org_id);
CREATE INDEX idx_org_quiz_attempts_user_quiz ON org_quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_org_quiz_attempts_org_id ON org_quiz_attempts(org_id);

-- RLS
ALTER TABLE org_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Admins can manage quizzes, members can view
CREATE POLICY "Admins can manage org quizzes" ON org_quizzes
    USING (org_id = (SELECT current_setting('app.current_org_id', true)));

-- Students can view quizzes in their org
CREATE POLICY "Members can view org quizzes" ON org_quizzes
    FOR SELECT USING (org_id = (SELECT current_setting('app.current_org_id', true)));

-- Attempts are private to user + viewable by org admins
CREATE POLICY "Users can manage own attempts" ON org_quiz_attempts
    USING (user_id = auth.uid()::text AND org_id = (SELECT current_setting('app.current_org_id', true)));

CREATE POLICY "Admins can view all attempts" ON org_quiz_attempts
    FOR SELECT USING (org_id = (SELECT current_setting('app.current_org_id', true)));
