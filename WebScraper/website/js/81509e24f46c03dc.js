document.addEventListener("DOMContentLoaded", function () {
    const chatWidget = document.getElementById("chatWidget");
    const messageList = document.getElementById("messageList");

    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");

    const attachmentBtn = document.getElementById("attachmentBtn");
    const fileInput = document.getElementById("fileInput");

    const minimizeBtn = document.getElementById("minimizeBtn");
    const closeBtn = document.getElementById("closeBtn");
    const homeBtn = document.getElementById("homeBtn");
    const moreBtn = document.getElementById("moreBtn");

    const botLauncher =
        document.getElementById("botLauncher") ||
        document.querySelector(".floating-chat-icon");

    const carouselTrack = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    const dots = document.querySelectorAll(".verify-chat-dot");
    const serviceButtons =
        document.querySelectorAll(".verify-chat-service-button");

    const cards =
        document.querySelectorAll(".verify-chat-service-wrapper");

    if (!chatWidget || !botLauncher) {
        return;
    }

    /* =========================
       فتح الشات
    ========================= */

    botLauncher.addEventListener("click", function () {
        chatWidget.classList.add("show");
        chatWidget.classList.remove("minimized");
        botLauncher.style.display = "none";

        scrollToBottom();
    });

    /* =========================
       إغلاق الشات
    ========================= */

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            chatWidget.classList.remove("show");
            chatWidget.classList.remove("minimized");

            botLauncher.style.display = "";
        });
    }

    /* =========================
       تصغير الشات
    ========================= */

    if (minimizeBtn) {
        minimizeBtn.addEventListener("click", function () {
            chatWidget.classList.toggle("minimized");
        });
    }

    /* =========================
       زر الرئيسية
    ========================= */

    if (homeBtn) {
        homeBtn.addEventListener("click", function () {
            chatWidget.classList.remove("minimized");

            if (messageList) {
                messageList.scrollTop = 0;
            }

            currentPage = 0;
            updateCarousel();
        });
    }

    /* =========================
       Carousel
    ========================= */

    const cardsPerPage = 2;
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    let currentPage = 0;

    function updateCarousel() {
        if (!carouselTrack || !cards.length) {
            return;
        }

        const cardWidth =
            cards[0].getBoundingClientRect().width || 155;

        const offset =
            currentPage * cardWidth * cardsPerPage;

        carouselTrack.style.transform =
            `translateX(-${offset}px)`;

        dots.forEach(function (dot, index) {
            dot.classList.toggle(
                "active",
                index === currentPage
            );
        });

        if (prevBtn) {
            prevBtn.disabled = currentPage === 0;
        }

        if (nextBtn) {
            nextBtn.disabled =
                currentPage >= totalPages - 1;
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            if (currentPage < totalPages - 1) {
                currentPage++;
                updateCarousel();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            if (currentPage > 0) {
                currentPage--;
                updateCarousel();
            }
        });
    }

    updateCarousel();

    /* =========================
       رسائل الخدمات
    ========================= */

    serviceButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const serviceName =
                button.dataset.service || "";

            addUserMessage(serviceName);

            setTimeout(function () {
                addBotMessage(
                    `تم اختيار خدمة "${serviceName}". كيف يمكنني مساعدتك؟`
                );
            }, 500);
        });
    });

    /* =========================
       إضافة رسالة المستخدم
    ========================= */

    function addUserMessage(text) {
        if (!messageList || !text) {
            return;
        }

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "verify-chat-user-message-wrapper";

        const message =
            document.createElement("div");

        message.className =
            "verify-chat-user-message";

        message.textContent = text;

        wrapper.appendChild(message);

        messageList.appendChild(wrapper);

        scrollToBottom();
    }

    /* =========================
       إضافة رسالة البوت
    ========================= */

    function addBotMessage(text) {
        if (!messageList || !text) {
            return;
        }

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "verify-chat-message-wrapper";

        const message =
            document.createElement("div");

        message.className =
            "verify-chat-bot-message";

        message.textContent = text;

        const meta =
            document.createElement("div");

        meta.className =
            "verify-chat-message-meta";

        meta.innerHTML =
            `<span>${getCurrentTime()}</span> - <span>bot</span>`;

        wrapper.appendChild(message);
        wrapper.appendChild(meta);

        messageList.appendChild(wrapper);

        scrollToBottom();
    }

    /* =========================
       إرسال رسالة
    ========================= */

    function sendMessage() {
        if (!chatInput) {
            return;
        }

        const text =
            chatInput.value.trim();

        if (!text) {
            return;
        }

        addUserMessage(text);

        chatInput.value = "";

        autoResize();

        setTimeout(function () {
            addBotMessage(
                "شكرًا لتواصلك. سيتم مساعدتك في أقرب وقت."
            );
        }, 700);
    }

    if (sendBtn) {
        sendBtn.addEventListener(
            "click",
            sendMessage
        );
    }

    if (chatInput) {
        chatInput.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {
                    event.preventDefault();
                    sendMessage();
                }
            }
        );
    }

    /* =========================
       تغيير ارتفاع مربع الكتابة
    ========================= */

    function autoResize() {
        if (!chatInput) {
            return;
        }

        chatInput.style.height = "28px";

        chatInput.style.height =
            Math.min(
                chatInput.scrollHeight,
                100
            ) + "px";
    }

    if (chatInput) {
        chatInput.addEventListener(
            "input",
            autoResize
        );
    }

    /* =========================
       رفع ملف
    ========================= */

    if (attachmentBtn && fileInput) {
        attachmentBtn.addEventListener(
            "click",
            function () {
                fileInput.click();
            }
        );

        fileInput.addEventListener(
            "change",
            function () {
                if (!fileInput.files.length) {
                    return;
                }

                const file =
                    fileInput.files[0];

                addUserMessage(
                    `📎 ${file.name}`
                );

                setTimeout(function () {
                    addBotMessage(
                        "تم استلام الملف بنجاح."
                    );
                }, 500);

                fileInput.value = "";
            }
        );
    }

    /* =========================
       زر المزيد
    ========================= */

    if (moreBtn) {
        moreBtn.addEventListener(
            "click",
            function () {
                addBotMessage(
                    "يمكنك اختيار إحدى الخدمات المتاحة أو كتابة استفسارك مباشرة."
                );
            }
        );
    }

    /* =========================
       الوقت الحالي
    ========================= */

    function getCurrentTime() {
        try {
            return new Intl.DateTimeFormat(
                "ar-SA",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            ).format(new Date());
        } catch (error) {
            return "الآن";
        }
    }

    /* =========================
       Scroll للأسفل
    ========================= */

    function scrollToBottom() {
        if (!messageList) {
            return;
        }

        setTimeout(function () {
            messageList.scrollTop =
                messageList.scrollHeight;
        }, 50);
    }
});
