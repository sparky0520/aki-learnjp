"use client";

import { useContext } from "react";
import AskAkiContext from "@/contexts/AkiContext";

export default function AIGeneratedPageModal() {
  const { pageModal, setPageModal } = useContext(AskAkiContext);
  const page = pageModal?.page;

  if (!pageModal?.isOpen || !page) return null;

  const handleClose = () => setPageModal({ isOpen: false, page: null });

  const isInteractive = page.mode === "interactive" || !!page.html;

  return (
    <div className="flex flex-col min-h-screen w-screen transition-colors duration-300 custom-scroll fixed inset-0 z-50">
      <div
        className="generated-page-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          className={
            isInteractive
              ? "generated-interactive-page"
              : "generated-page-modal"
          }
          style={{
            backgroundColor: page.backgroundColor || "#fffce8",
          }}
        >
          <button className="generated-page-close" onClick={handleClose}>
            ✕
          </button>

          {page.css && <style>{page.css}</style>}

          {isInteractive ? (
            <>
              {/* Interactive: heading + description + full-height area + footer */}
              <header className="generated-interactive-header">
                <h1 className="generated-interactive-title">{page.title}</h1>
                {page.description && (
                  <p className="generated-interactive-description">
                    {page.description}
                  </p>
                )}
              </header>

              <main className="generated-interactive-main">
                <div
                  id="generated-game-root"
                  className="generated-interactive-canvas"
                />
              </main>

              <footer className="generated-interactive-footer">
                <span>{page.footerStatus}</span>
              </footer>
            </>
          ) : (
            <>
              {/* Static sections layout */}
              <h1
                className="generated-page-title"
                style={{ color: page.accentColor || "#4CAF50" }}
              >
                {page.title}
              </h1>

              <div className="generated-page-content">
                {Array.isArray(page.sections) &&
                  page.sections.map((section: any, idx: number) => (
                    <section key={idx} className="generated-page-section">
                      {section.heading && (
                        <h2
                          className="generated-page-heading"
                          style={{ color: page.accentColor || "#4CAF50" }}
                        >
                          {section.heading}
                        </h2>
                      )}
                      {section.body && (
                        <p className="generated-page-body">{section.body}</p>
                      )}
                    </section>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
