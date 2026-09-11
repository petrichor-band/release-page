const ANALYTICS_CONFIG = {
    TRACK_URL: "https://minondxdissssqrzhwuu.supabase.co/functions/v1/track",
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
    const payload = {
        type: "session",
        session_id: getSessionId(),
        ...getUtmParams()
    };

    try {
        const response = await fetch(
            ANALYTICS_CONFIG.TRACK_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                keepalive: true
            }
        );

        if (!response.ok) {
            console.error(
                "Analytics session error:",
                response.status
            );
        }
    } catch (error) {
        console.error("Analytics session failed:", error);
    }
}


function registerClick(platform) {
    const payload = {
        type: "click",
        session_id: getSessionId(),
        platform,
        ...getUtmParams()
    };

    fetch(
        ANALYTICS_CONFIG.TRACK_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            keepalive: true
        }
    ).catch(error => {
        console.error("Analytics click failed:", error);
    });
}


document.addEventListener("DOMContentLoaded", () => {

    registerPageView();

    const buttons = document.querySelectorAll("[data-platform]");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const platform = button.dataset.platform;

            registerClick(platform);
        });
    });
});