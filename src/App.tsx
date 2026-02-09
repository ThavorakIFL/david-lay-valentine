// import './App.css'
import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import APlayer from "aplayer";
import "aplayer/dist/APlayer.min.css";

const generateHearts = () => {
    const newHearts = [];
    for (let i = 0; i < 15; i++) {
        const size = Math.random() * 30 + 15; // Random size (15px - 45px)
        newHearts.push({
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                bottom: "-50px", // ✅ ADD THIS - hearts need to start below viewport
                animationDuration: `${Math.random() * 4 + 2}s`, // Random speed (2s-6s)
                animationDelay: `${Math.random() * 2}s`, // Random delay
                width: `${size}px`,
                height: `${size}px`,
            } as React.CSSProperties,
        });
    }
    return newHearts;
};

function App() {
    const [noPosition, setNoPosition] = useState({ left: "0px", top: "0px" });
    const [isMouseClose, setIsMouseClose] = useState(false);
    const [currentCard, setCurrentCard] = useState(1);
    const [showMusicOverlay, setShowMusicOverlay] = useState(true);
    const [hearts] =
        useState<Array<{ id: number; style: React.CSSProperties }>>(
            generateHearts(),
        );
    const noBtnRef = useRef<HTMLButtonElement>(null);
    const yesBtnRef = useRef<HTMLButtonElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const aplayer = useRef<any>(null);

    const initializeNoButtonPosition = () => {
        if (!yesBtnRef.current || !noBtnRef.current) return;

        const yesRect = yesBtnRef.current.getBoundingClientRect();
        const noBtn = noBtnRef.current;
        const viewportWidth = window.innerWidth;

        // Get button widths
        const noBtnWidth = noBtn.offsetWidth || 100;

        // Responsive gap between buttons
        let gap;
        if (viewportWidth < 576) {
            gap = 80; // Mobile - good spacing without being too far apart
        } else if (viewportWidth < 768) {
            gap = 120; // Small tablets
        } else if (viewportWidth < 992) {
            gap = 180; // Medium tablets/small laptops
        } else {
            gap = 250; // Desktop - your current value
        }
        // Position No button to the right of Yes button with gap
        const calculatedLeft = yesRect.right + gap;

        // Ensure it doesn't overflow viewport
        const maxLeft = viewportWidth - noBtnWidth - 20; // 20px margin
        const finalLeft = Math.min(calculatedLeft, maxLeft);

        // If it would overflow, position it below the Yes button instead on mobile
        let finalTop = yesRect.top;
        if (finalLeft >= maxLeft && viewportWidth < 576) {
            // On mobile, if no room to the right, position below
            finalTop = yesRect.bottom + 20;
        }

        setNoPosition({
            left: Math.max(10, finalLeft) + "px", // Minimum 10px from left edge
            top: finalTop + "px",
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!noBtnRef.current) return;

        const btnRect = noBtnRef.current.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(e.clientX - (btnRect.left + btnRect.width / 2), 2) +
                Math.pow(e.clientY - (btnRect.top + btnRect.height / 2), 2),
        );

        // If mouse is within 100px of the button, show sad gif
        if (distance < 100) {
            setIsMouseClose(true);
        } else {
            setIsMouseClose(false);
        }
    };

    const handleMouseLeave = () => {
        setIsMouseClose(false);
    };

    const handleNoHover = () => {
        if (!noBtnRef.current) return;

        const btnRect = noBtnRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Add safety margins to prevent scrolling
        const margin = 20; // pixels from edge

        const maxX = viewportWidth - btnRect.width - margin;
        const maxY = viewportHeight - btnRect.height - margin;

        // Generate random position within safe bounds
        const randomX = Math.max(margin, Math.random() * maxX);
        const randomY = Math.max(margin, Math.random() * maxY);

        setNoPosition({
            left: randomX + "px",
            top: randomY + "px",
        });
    };

    const handleYesClick = () => {
        confetti({
            particleCount: 260,
            spread: 120,
            origin: { y: 0.65 },
        });

        setTimeout(() => {
            setCurrentCard(2);
        }, 500);
    };

    const handlePlayMusic = () => {
        if (aplayer.current) {
            aplayer.current.play();
        }
        setShowMusicOverlay(false);
    };

    useEffect(() => {
        initializeNoButtonPosition();

        window.addEventListener("resize", initializeNoButtonPosition);

        // Initialize APlayer
        aplayer.current = new APlayer({
            container: document.getElementById("aplayer"),
            mini: true,
            theme: "#FADFA3",
            preload: "auto",
            autoplay: false,
            fixed: true,
            audio: [
                {
                    name: "Only Girl",
                    artist: "Stephen Sanchez",
                    url: "/url1.mp3",
                    cover: "/album.jpg",
                    theme: "#FADFA3",
                },
            ],
        });

        return () =>
            window.removeEventListener("resize", initializeNoButtonPosition);
    }, []);

    return (
        <>
            {showMusicOverlay && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10000,
                        backdropFilter: "blur(5px)",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            borderRadius: "20px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "2px solid rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <h1
                            style={{
                                color: "#ffffff",
                                fontSize: "2.5rem",
                                marginBottom: "10px",
                                textShadow: "0 0 10px #f26a8d",
                            }}
                        >
                            🎵 Your Valentine Awaits
                        </h1>
                        <p
                            style={{
                                color: "#ffffff",
                                fontSize: "1.2rem",
                                marginBottom: "30px",
                            }}
                        >
                            Would you like to play some music?
                        </p>
                        <div
                            style={{
                                display: "flex",
                                gap: "20px",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={handlePlayMusic}
                                style={{
                                    padding: "15px 40px",
                                    fontSize: "1.1rem",
                                    borderRadius: "50px",
                                    border: "none",
                                    background:
                                        "linear-gradient(135deg, #ff4d6d, #ff758f)",
                                    color: "white",
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 10px 30px rgba(255, 77, 109, 0.4)",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "scale(1.05)";
                                    e.currentTarget.style.boxShadow =
                                        "0 15px 40px rgba(255, 77, 109, 0.6)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "scale(1)";
                                    e.currentTarget.style.boxShadow =
                                        "0 10px 30px rgba(255, 77, 109, 0.4)";
                                }}
                            >
                                Play 🎵
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Hearts */}
            <div className="hearts-container">
                {hearts.map((heart) => (
                    <div key={heart.id} className="heart" style={heart.style}>
                        <svg
                            viewBox="0 0 32 32"
                            enableBackground="new 0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16,8.064c-2.974-2.753-7.796-2.753-10.77,0s-2.974,7.215,0,9.968L16,28l10.77-9.968 c2.974-2.753,2.974-7.215,0-9.968S18.974,5.312,16,8.064z"
                                fill="#B83B5E"
                            />
                            <path
                                d="M7.23,17.032c-2.974-2.753-2.974-7.215,0-9.968c0.257-0.237,0.531-0.447,0.813-0.643 C7.017,6.761,6.052,7.304,5.23,8.064c-2.974,2.753-2.974,7.215,0,9.968L16,28l1.54-1.426L7.23,17.032z"
                                fill="#8A2C47"
                            />
                            <path
                                d="M26.77,8.064c-2.974-2.753-7.796-2.753-10.77,0c-2.974-2.753-7.796-2.753-10.77,0 c-0.91,0.843-1.539,1.846-1.892,2.911C6.342,8.317,12.06,8.343,15,11.064c2.974-2.753,6.796-2.753,9.77,0 c2.069,1.915,2.694,4.656,1.885,7.074l0.115-0.106C29.743,15.28,29.743,10.817,26.77,8.064z"
                                fill="#C6627E"
                            />
                            <path
                                d="M16,8.064c-2.974-2.753-7.796-2.753-10.77,0s-2.974,7.215,0,9.968L16,28l10.77-9.968c2.974-2.753,2.974-7.215,0-9.968 S18.974,5.312,16,8.064z"
                                fill="none"
                                stroke="#8A2C47"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="2"
                            />
                            <path
                                d="M22,10.044c0.784,0.113,1.497,0.443,2.052,0.956C24.663,11.565,25,12.293,25,13.048"
                                fill="none"
                                stroke="#FFFFFF"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                ))}
            </div>

            <div
                className="viewport-container"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {currentCard === 1 ? (
                    <div className="card" ref={cardRef}>
                        <img
                            src={
                                isMouseClose
                                    ? "/sad-gif-1.gif"
                                    : "/cute-gif-1.gif"
                            }
                            alt="Valentine"
                            className="card-gif"
                        />
                        <h1 className="main-text">
                            💖 Will you be my Valentine? 💖
                        </h1>
                        <div className="buttons">
                            <button
                                id="yes"
                                ref={yesBtnRef}
                                onClick={handleYesClick}
                            >
                                Yes 💖
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="card card-second animate-card"
                        ref={cardRef}
                    >
                        <img
                            src="/main-image.png"
                            alt="Valentine"
                            className="card-main-image animate-image"
                        />
                        <h1 className="main-text animate-text">
                            💝 You make me the happiest! 💝
                        </h1>
                        <p className="cute-text animate-text">
                            Let's make this Valentine's Day unforgettable
                            together! 💕
                        </p>
                    </div>
                )}
                {currentCard === 1 && (
                    <button
                        id="no"
                        ref={noBtnRef}
                        onMouseEnter={handleNoHover}
                        style={noPosition}
                    >
                        No 🙈
                    </button>
                )}
            </div>

            <div id="aplayer"></div>
        </>
    );
}

export default App;
