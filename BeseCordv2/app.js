document.addEventListener("DOMContentLoaded", () => {
    const loginPanel = document.getElementById("login-panel");
    const mainApp = document.getElementById("main-app");
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const chatArea = document.getElementById("chat-area");
    const messageInput = document.getElementById("message-input");
    const messageSearch = document.getElementById("message-search");
    const searchButton = document.getElementById("search-button");
    const sendMessageButton = document.getElementById("send-message");
    const channelList = document.getElementById("channel-list");
    const themeToggle = document.getElementById("theme-toggle");

    const currentChannel = document.getElementById("current-channel");
    const userList = document.getElementById("user-list");
    const settingsPanel = document.getElementById("settings-panel");
    const openSettingsButton = document.getElementById("open-settings");
    const closeSettingsButton = document.getElementById("close-settings");
    const addChannelButton = document.getElementById("add-channel");
    const deleteChannelButton = document.getElementById("delete-channel");
    const emojiPickerButton = document.getElementById("send-emoji");

    // Kullanıcı Profili Modeli
    const userProfileModal = document.getElementById("user-profile-modal");
    const closeProfileModal = document.getElementById("close-profile-modal");
    const profileAvatar = document.getElementById("profile-avatar");
    const profileUsername = document.getElementById("profile-username");
    const profileStatus = document.getElementById("profile-status");

    const state = {
        username: localStorage.getItem("username") || null,
        avatar: localStorage.getItem("avatar") || 'https://via.placeholder.com/150',
        theme: localStorage.getItem("theme") || "light",
        customTheme: JSON.parse(localStorage.getItem("customTheme")) || null,
        users: {
            User1: { 
                avatar: 'https://via.placeholder.com/150?text=User1',
                status: 'Online',
                lastSeen: new Date()
            },
            User2: { 
                avatar: 'https://via.placeholder.com/150?text=User2',
                status: 'Away',
                lastSeen: new Date(Date.now() - 1000 * 60 * 15)
            },
            User3: { 
                avatar: 'https://via.placeholder.com/150?text=User3',
                status: 'Online',
                lastSeen: new Date()
            },
            User4: { 
                avatar: 'https://via.placeholder.com/150?text=User4',
                status: 'Offline',
                lastSeen: new Date(Date.now() - 1000 * 60 * 60)
            }
        },
        channels: {
            general: [],
            random: [],
            memes: [],
            "tech-talk": [],
        },
        pinnedMessages: JSON.parse(localStorage.getItem("pinnedMessages")) || {},
        currentChannel: "general",
    };

    // Temayı Başlatma
    function initializeTheme() {
        if (state.theme === "dark") {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        if (state.customTheme) {
            const root = document.documentElement;
            Object.entries(state.customTheme).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        }
    }

    // Tema Kişileştirme
    function customizeTheme() {
        const customTheme = {
            '--accent-color': prompt('Vurgu rengini girin (e.g., #3b82f6):', state.customTheme?.['--accent-color'] || '#3b82f6'),
            '--hover-color': prompt('Hover rengini girin (e.g., #2563eb):', state.customTheme?.['--hover-color'] || '#2563eb'),
            '--text-primary': prompt('Birincil yazı rengi:', state.customTheme?.['--text-primary'] || (state.theme === 'dark' ? '#ffffff' : '#111827')),
            '--text-secondary': prompt('İkincil yazı rengi:', state.customTheme?.['--text-secondary'] || (state.theme === 'dark' ? '#9ca3af' : '#4b5563'))
        };

        const isValidColor = (color) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
        
        if (Object.values(customTheme).every(color => isValidColor(color))) {
            state.customTheme = customTheme;
            localStorage.setItem('customTheme', JSON.stringify(customTheme));
            initializeTheme();
        } else {
            alert('Yanlış renk formatı! Lütfen hexadecimal renk kullanın (e.g., #ff0000)');
        }
    }

    // Ayarlar menüsü 
    const settingsForm = document.getElementById("settings-form");
    const customizeThemeButton = document.createElement("button");
    customizeThemeButton.className = "w-full p-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold mt-4";
    customizeThemeButton.textContent = "Temayı Değiştir";
    customizeThemeButton.type = "button";
    customizeThemeButton.addEventListener("click", customizeTheme);
    settingsForm.appendChild(customizeThemeButton);

    // Tema Resetleme
    const resetThemeButton = document.createElement("button");
    resetThemeButton.className = "w-full p-3 rounded bg-red-600 hover:bg-red-700 text-white font-bold mt-2";
    resetThemeButton.textContent = "Temayı Sıfırla";
    resetThemeButton.type = "button";
    resetThemeButton.addEventListener("click", () => {
        state.customTheme = null;
        localStorage.removeItem('customTheme');
        initializeTheme();
    });
    settingsForm.appendChild(resetThemeButton);

    // Animasyonlu tema değişimi
    themeToggle.addEventListener("click", () => {
        const icon = themeToggle.querySelector('i');
        icon.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            state.theme = state.theme === "light" ? "dark" : "light";
            localStorage.setItem("theme", state.theme);
            initializeTheme();
            icon.style.transform = 'rotate(0deg)';
        }, 200);
    });

    initializeTheme();

    // Son Açık Kanalı Yükle
    const lastChannel = localStorage.getItem("currentChannel");
    if (lastChannel) {
        changeChannel(lastChannel);
    }

    // Login Animasyonu
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username === "admin" && password === "123a") {
            state.username = username;
            localStorage.setItem("username", username);
            
            // fade-out
            loginPanel.style.opacity = '0';
            loginPanel.style.transform = 'scale(0.95)';
            loginPanel.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                loginPanel.style.display = "none";
                mainApp.style.display = "flex";
                mainApp.style.opacity = '0';
                
                // fade-in
                setTimeout(() => {
                    mainApp.style.opacity = '1';
                    mainApp.style.transform = 'scale(1)';
                    mainApp.style.transition = 'all 0.3s ease';
                }, 50);
                
                loadChannelMessages();
            }, 300);
        } else {
            const errorMessage = document.createElement("p");
            errorMessage.className = "text-red-500 text-sm mt-2 animate-shake";
            errorMessage.textContent = "Invalid username or password.";
            loginForm.appendChild(errorMessage);
            
            // shake animasyonu
            [usernameInput, passwordInput].forEach(input => {
                input.style.animation = 'shake 0.5s ease';
                setTimeout(() => input.style.animation = '', 500);
            });
        }
    });

    // Yazı Çeşidi
    function parseMarkdown(text) {
        text = text.replace(/[&<>"']/g, function(match) {
            const escape = {
                '&': '&amp;',
                '<': '<',
                '>': '>',
                '"': '"',
                "'": '&#39;'
            };
            return escape[match];
        });

        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1 rounded">$1</code>');
        
        return text;
    }

    // Sorunsuz geçişlere sahip kanal mesajları
    function loadChannelMessages(searchQuery = '') {
        chatArea.style.opacity = '0';
        chatArea.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            chatArea.innerHTML = "";
            const messages = state.channels[state.currentChannel] || [];
            const pinnedMessages = state.pinnedMessages[state.currentChannel] || [];
            
            if (pinnedMessages.length > 0) {
                const pinnedSection = document.createElement("div");
                pinnedSection.className = "pinned-messages-section mb-4 border-b dark:border-gray-600 pb-4";
                chatArea.appendChild(pinnedSection);
                
                pinnedMessages.forEach(message => {
                    const messageElement = appendMessage(message, true);
                    pinnedSection.appendChild(messageElement);
                });
            }

            const filteredMessages = searchQuery 
                ? messages.filter(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
                : messages;
            filteredMessages.forEach((message) => {
                if (!pinnedMessages.some(pin => pin.timestamp === message.timestamp)) {
                    appendMessage(message, false);
                }
            });
            currentChannel.textContent = `# ${state.currentChannel}`;
            
            // fade-in mesaj alanı
            chatArea.style.opacity = '1';
            chatArea.style.transform = 'translateY(0)';
            chatArea.style.transition = 'all 0.3s ease';
        }, 150);
    }

    // Mesaj Arama
    function searchMessages() {
        const searchQuery = messageSearch.value.trim();
        
        // Yükleme animasyonu
        searchButton.querySelector('i').classList.add('fa-spin');
        
        setTimeout(() => {
            loadChannelMessages(searchQuery);
            searchButton.querySelector('i').classList.remove('fa-spin');
        }, 300);
    }

    searchButton.addEventListener("click", searchMessages);

    messageSearch.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            searchMessages();
        }
    });

    messageSearch.addEventListener("input", (event) => {
        if (event.target.value === "") {
            loadChannelMessages();
        }
    });

    // Mesaj Gönderme
    sendMessageButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (!messageText) return;

        // Gönderme Animasyonu
        sendMessageButton.classList.add('sending');
        sendMessageButton.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            const message = {
                user: state.username,
                text: messageText,
                formattedText: parseMarkdown(messageText),
                timestamp: new Date(),
            };

            state.channels[state.currentChannel].push(message);
            appendMessage(message);
            messageInput.value = "";
            saveMessages();
            
            // Reset button state
            sendMessageButton.classList.remove('sending');
            sendMessageButton.style.transform = 'scale(1)';
        }, 150);
    }

    // Gelişmiş animasyonlarla mesaj DOM manipülasyonu
    function appendMessage(message, isPinned = false) {
        const messageElement = document.createElement("div");
        messageElement.className = `message mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded ${isPinned ? 'pinned-message' : ''}`;
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        messageElement.innerHTML = `
            <div>
                ${isPinned ? '<i class="fas fa-thumbtack text-blue-500 mr-2"></i>' : ''}
                <strong>${message.user}</strong>
                <span class="text-sm text-gray-500 dark:text-gray-400">(${new Date(
                    message.timestamp
                ).toLocaleTimeString()})</span>
                <p>${message.formattedText || parseMarkdown(message.text)}</p>
            </div>
            <div class="message-actions">
                <button class="pin-message" title="${isPinned ? 'Unpin' : 'Pin'}">
                    <i class="fas fa-thumbtack ${isPinned ? 'text-blue-500' : ''}"></i>
                </button>
                <button class="edit-message" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-message" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        const deleteButton = messageElement.querySelector(".delete-message");
        deleteButton.addEventListener("click", () => {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateX(20px)';
            messageElement.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                messageElement.remove();
                state.channels[state.currentChannel] = state.channels[state.currentChannel].filter(
                    (m) => m.timestamp !== message.timestamp
                );
                saveMessages();
            }, 300);
        });

        const editButton = messageElement.querySelector(".edit-message");
        editButton.addEventListener("click", () => {
            const newText = prompt("Yeni mesajı girin:", message.text);
            if (newText) {
                const messageContent = messageElement.querySelector("p");
                messageContent.style.opacity = '0';
                
                setTimeout(() => {
                    message.text = newText;
                    message.formattedText = parseMarkdown(newText);
                    messageContent.innerHTML = message.formattedText;
                    messageContent.style.opacity = '1';
                    messageContent.style.transition = 'opacity 0.3s ease';
                    saveMessages();
                }, 200);
            }
        });

        chatArea.appendChild(messageElement);
        
        // Giriş Animasyonunu Tetikleme
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
            messageElement.style.transition = 'all 0.3s ease';
        }, 50);
        
        chatArea.scrollTop = chatArea.scrollHeight;
        
        return messageElement;
    }

    // Önizleme animasyonu ile avatar yükleme işlemi
    const avatarInput = document.getElementById("settings-avatar");
    avatarInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                state.avatar = e.target.result;
                localStorage.setItem("avatar", state.avatar);
                
                if (state.username && state.users[state.username]) {
                    const avatarImg = document.querySelector('.profile-avatar-container img');
                    if (avatarImg) {
                        avatarImg.style.opacity = '0';
                        setTimeout(() => {
                            state.users[state.username].avatar = state.avatar;
                            avatarImg.src = state.avatar;
                            avatarImg.style.opacity = '1';
                            avatarImg.style.transition = 'opacity 0.3s ease';
                        }, 200);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Gelişmiş animasyonlarla kullanıcı profilini inceleme
    window.viewProfile = function(username) {
        const user = state.users[username];
        if (!user) return;

        profileUsername.textContent = username;
        profileAvatar.src = user.avatar;
        profileStatus.textContent = user.status;
        profileStatus.dataset.status = user.status;

        const lastSeenText = user.status === 'Online' 
            ? 'Currently Online'
            : `Last seen: ${new Date(user.lastSeen).toLocaleString()}`;
        
        const lastSeenElement = document.getElementById("profile-last-seen") || document.createElement("div");
        lastSeenElement.id = "profile-last-seen";
        lastSeenElement.className = "text-sm text-gray-500 dark:text-gray-400 mt-2";
        lastSeenElement.textContent = lastSeenText;
        
        profileStatus.parentNode.insertBefore(lastSeenElement, profileStatus.nextSibling);

      
        userProfileModal.classList.remove("hidden");
        const modalContent = userProfileModal.querySelector('.bg-white');
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
            modalContent.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 50);
    };

    closeProfileModal.addEventListener("click", () => {
        const modalContent = userProfileModal.querySelector('.bg-white');
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            userProfileModal.classList.add("hidden");
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 300);
    });

    userProfileModal.addEventListener("click", (event) => {
        if (event.target === userProfileModal) {
            closeProfileModal.click();
        }
    });

    // Kanal yönetimi
    addChannelButton.addEventListener("click", () => {
        const newChannel = prompt("Kanal adını girin:");
        if (newChannel && !state.channels[newChannel]) {
            addChannelButton.style.transform = 'rotate(180deg)';
            
            setTimeout(() => {
                state.channels[newChannel] = [];
                updateChannelList();
                addChannelButton.style.transform = 'rotate(0deg)';
                addChannelButton.style.transition = 'transform 0.3s ease';
            }, 200);
        } else {
            alert("Kanal zaten var ve ya geçersiz.");
        }
    });

    function updateChannelList() {
        channelList.style.opacity = '0';
        
        setTimeout(() => {
            channelList.innerHTML = "";
            Object.keys(state.channels).forEach((channel) => {
                const channelElement = document.createElement("li");
                channelElement.className = "mb-2";
                channelElement.innerHTML = `
                    <a href="#" class="block p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" data-channel="${channel}">
                        # ${channel}
                    </a>
                `;
                channelList.appendChild(channelElement);
            });
            
            channelList.style.opacity = '1';
            channelList.style.transition = 'opacity 0.3s ease';
        }, 200);
    }

    channelList.addEventListener("click", (event) => {
        const channel = event.target.dataset.channel;
        if (channel && state.channels[channel]) {
            changeChannel(channel);
        }
    });

    function changeChannel(channel) {
        chatArea.style.opacity = '0';
        chatArea.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            state.currentChannel = channel;
            localStorage.setItem("currentChannel", channel);
            loadChannelMessages();
            
            chatArea.style.opacity = '1';
            chatArea.style.transform = 'translateY(0)';
            chatArea.style.transition = 'all 0.3s ease';
        }, 200);
    }

    deleteChannelButton.addEventListener("click", () => {
        if (state.currentChannel === "general") {
            alert("Ana kanal silinemez.");
            return;
        }

        if (confirm(`Bu kanalı ${state.currentChannel} silmek istediğinize emin misiniz?`)) {
            const channelElement = channelList.querySelector(`[data-channel="${state.currentChannel}"]`);
            if (channelElement) {
                channelElement.style.transform = 'translateX(100%)';
                channelElement.style.opacity = '0';
                channelElement.style.transition = 'all 0.3s ease';
            }
            
            setTimeout(() => {
                delete state.channels[state.currentChannel];
                state.currentChannel = "general";
                loadChannelMessages();
                updateChannelList();
                saveMessages();
            }, 300);
        }
    });

    // Emoji Picker
    emojiPickerButton.addEventListener("click", () => {
        const emojis = ["😊", "😂", "❤️", "🔥", "👍", "🎉"];
        const emojiMenu = document.createElement("div");
        emojiMenu.className = "absolute bg-white dark:bg-gray-700 border dark:border-gray-600 p-2 rounded shadow-md flex gap-2";
        emojiMenu.style.top = `${emojiPickerButton.offsetTop + emojiPickerButton.offsetHeight}px`;
        emojiMenu.style.left = `${emojiPickerButton.offsetLeft}px`;
        emojiMenu.style.opacity = '0';
        emojiMenu.style.transform = 'translateY(10px)';

        emojis.forEach((emoji) => {
            const emojiButton = document.createElement("button");
            emojiButton.className = "emoji-button text-xl hover:transform hover:scale-125 transition-transform";
            emojiButton.textContent = emoji;
            emojiButton.addEventListener("click", () => {
                messageInput.value += emoji;
                emojiMenu.style.opacity = '0';
                emojiMenu.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    emojiMenu.remove();
                }, 300);
            });
            emojiMenu.appendChild(emojiButton);
        });

        document.body.appendChild(emojiMenu);
        
        setTimeout(() => {
            emojiMenu.style.opacity = '1';
            emojiMenu.style.transform = 'translateY(0)';
            emojiMenu.style.transition = 'all 0.3s ease';
        }, 50);

        document.addEventListener("click", (event) => {
            if (!emojiMenu.contains(event.target) && event.target !== emojiPickerButton) {
                emojiMenu.style.opacity = '0';
                emojiMenu.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    emojiMenu.remove();
                }, 300);
            }
        }, { once: true });
    });

    // Ayarlar Paneli
    openSettingsButton.addEventListener("click", () => {
        settingsPanel.classList.remove("hidden");
        settingsPanel.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            settingsPanel.style.transform = 'translateX(0)';
            settingsPanel.style.transition = 'transform 0.3s ease';
        }, 50);
    });

    closeSettingsButton.addEventListener("click", () => {
        settingsPanel.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            settingsPanel.classList.add("hidden");
        }, 300);
    });

    // Çıkış Yapma
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            mainApp.style.opacity = '0';
            mainApp.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                localStorage.clear();
                location.reload();
            }, 300);
        });
    }

    // Mesaj Depolama
    function saveMessages() {
        localStorage.setItem("channels", JSON.stringify(state.channels));
        localStorage.setItem("pinnedMessages", JSON.stringify(state.pinnedMessages));
    }

    function loadMessages() {
        const savedChannels = localStorage.getItem("channels");
        const savedPinnedMessages = localStorage.getItem("pinnedMessages");
        if (savedChannels) {
            state.channels = JSON.parse(savedChannels);
        }
        if (savedPinnedMessages) {
            state.pinnedMessages = JSON.parse(savedPinnedMessages);
        }
    }

    // Mesaj Sabitleme
    chatArea.addEventListener("click", (event) => {
        const pinButton = event.target.closest(".pin-message");
        if (!pinButton) return;

        const messageElement = pinButton.closest(".message");
        const messageText = messageElement.querySelector("p").textContent;
        const messageTimestamp = new Date(messageElement.querySelector("span").textContent.match(/\((.*?)\)/)[1]);
        const messageUser = messageElement.querySelector("strong").textContent;

        const message = {
            user: messageUser,
            text: messageText,
            timestamp: messageTimestamp,
        };

        if (!state.pinnedMessages[state.currentChannel]) {
            state.pinnedMessages[state.currentChannel] = [];
        }

        const isPinned = messageElement.classList.contains("pinned-message");
        
        
        messageElement.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            if (isPinned) {
                state.pinnedMessages[state.currentChannel] = state.pinnedMessages[state.currentChannel]
                    .filter(msg => msg.timestamp.toString() !== messageTimestamp.toString());
            } else {
                state.pinnedMessages[state.currentChannel].push(message);
            }

            saveMessages();
            loadChannelMessages();
        }, 200);
    });

   
    updateChannelList();
    loadChannelMessages();
    loadMessages();
});
