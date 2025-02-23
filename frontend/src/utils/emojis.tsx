import { ReactNode } from "react";
import { ExpressionlessFace } from "../assets/svg/expressionless-face";
import { SmilingFaceWithSmilingEyes } from "@/assets/svg/smiling-face-with-smiling-eyes";
import { GrinningFaceWithSmilingEyes } from "@/assets/svg/grinning-face-with-smiling-eyes";
import { HushedFace } from "@/assets/svg/hushed-face";
import { FaceScreamingInFear } from "@/assets/svg/face-screaming-in-fear";

export const emojis: { [key: string]: ReactNode } = {
    "face/expressionless-face": <ExpressionlessFace className="size-6 lg:size-7" />,
    "face/smiling-face-with-smiling-eyes": <SmilingFaceWithSmilingEyes className="size-6 lg:size-7" />,
    "face/grinning-face-with-smiling-eyes": <GrinningFaceWithSmilingEyes className="size-6 lg:size-7" />,
    "face/smiling-face-with-sunglasses": <SmilingFaceWithSmilingEyes className="size-6 lg:size-7" />,
    "face/hushed-face": <HushedFace className="size-6 lg:size-7" />,
    "face/face-screaming-in-fear": <FaceScreamingInFear className="size-6 lg:size-7" />,
}