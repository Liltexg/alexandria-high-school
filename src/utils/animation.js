// Alexandria High School - Motion Design Language
// "Alive, Composed, Intentional"

export const transition = {
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1], // Custom calm cubic-bezier (similar to "easeOutQuint" but smoother)
};

export const transitionSlow = {
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1],
};

export const stagger = {
    container: {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    },
    item: {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: transition
        },
    },
};

export const reveal = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: transition
    },
};

export const revealFade = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { ...transition, duration: 1.5 } // Slower fade for distinct premium feel
    }
}

export const textReveal = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { ...transition, duration: 1.0 }
    }
};
