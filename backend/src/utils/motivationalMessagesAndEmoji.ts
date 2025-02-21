export function getMotivationalMessageAndEmoji(streak: number) {
    if (streak < 5) {
        return {
            message: "Todo grande hábito começa com um primeiro passo. Continue assim!",
            emoji: "face/expressionless-face",
        };
    } else if (streak < 10) {
        return {
            message: "Você está criando um ótimo hábito! Continue assim e torne isso parde da sua rotina!",
            emoji: "face/smiling-face-with-smiling-eyes",
        };
    } else if (streak < 20) {
        return {
            message: "Incrível! Você já chegou longe! O que mais você pode alcançar com essa consistência?",
            emoji: "face/grinning-face-with-smiling-eyes",
        };
    } else if (streak < 30) {
        return {
            message: "Você está voando! Essa consistência está te levando a um novo nível!",
            emoji: "face/smiling-face-with-sunglasses",
        };
    } else if (streak < 40) {
        return {
            message: "Uau! Quase ninguém chega tão longe! Você está se tornando uma lenda!",
            emoji: "face/hushed-face",
        }
    } else {
        return {
            message: "Isso é insano! Você quebrou todos os limites! Quem pode te parar agora?",
            emoji: "face/face-screaming-in-fear",
        };
    }
}