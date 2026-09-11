const ANALYTICS_CONFIG = {
    API_BASE: "http://localhost:5000",
};


function getSessionId() {
    const idKey = "release_session_id";
    const timeKey = "release_session_last_activity";

    const now = Date.now();
    const timeout = 30 * 60 * 1000;

    let sessionId = localStorage.getItem(idKey);
    const storedTime = localStorage.getItem(timeKey);
    const lastActivity = Number(storedTime);

    if (
        !sessionId ||
        !lastActivity ||
        now - lastActivity > timeout
    ) {
        sessionId = crypto.randomUUID();
        localStorage.setItem(idKey, sessionId);
    }

    localStorage.setItem(timeKey, String(now));

    return sessionId;
}


function getUtmParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        utm_content: params.get("utm_content")
    };
}

async function registerPageView() {

    const sessionId = getSessionId();

    const payload = {
        session_id: sessionId,
        ...getUtmParams()
    };

    console.log("📤 Page view :", payload);

    try {
        const response = await fetch(
            `${ANALYTICS_CONFIG.API_BASE}/api/session`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        console.log("📥 Session API :", response.status);

    } catch (error) {
        console.error("❌ Erreur session analytics :", error);
    }
}


async function registerClick(platform) {
    const payload = {
        session_id: getSessionId(),
        platform: platform
    };

    console.log("📤 Streaming click :", payload);

    try {
        const response = await fetch(
            `${ANALYTICS_CONFIG.API_BASE}/api/click`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        console.log("📥 Click API :", response.status);

    } catch (error) {
        console.error("❌ Erreur click analytics :", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ release-tracking.js chargé");

    registerPageView();

    const buttons = document.querySelectorAll("[data-platform]");

    console.log(`✅ ${buttons.length} boutons détectés`);

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const platform = button.dataset.platform;

            console.log("🖱️ Clic plateforme :", platform);

            registerClick(platform);
        });
    });
});