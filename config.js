const SUPABASE_URL = "https://gfyjrvqqnkfbrbeolkan.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeWpydnFxbmtmYnJiZW9sa2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MDU1MDEsImV4cCI6MjEwNTM4MTUwMX0.y6AdLHhm9LlIgTSXrJTqlBWaTDFUezLXPPNa0TU-drk";

const HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": `Bearer ${ANON_KEY}`,
    "Content-Type": "application/json"
};

// دالةرفع الصور إلى Storage Bucket باسم photo
async function uploadImages(fileInputId) {
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput || !fileInput.files.length) return [];
    
    const uploadedUrls = [];
    for (let file of fileInput.files) {
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/photo/${fileName}`, {
            method: "POST",
            headers: {
                "apikey": ANON_KEY,
                "Authorization": `Bearer ${ANON_KEY}`,
                "Content-Type": file.type
            },
            body: file
        });
        if (uploadRes.ok) {
            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/photo/${fileName}`;
            uploadedUrls.push(publicUrl);
        }
    }
    return uploadedUrls;
}

// دالة طلب إذن الإشعارات وتنبيه المستخدم
function notifyUser(title, body) {
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification(title, { body: body, icon: "https://cdn-icons-png.flaticon.com/512/3602/3602145.png" });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: body });
                }
            });
        }
    }
}