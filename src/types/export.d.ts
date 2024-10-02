import { Feedback } from '.';
import { ContentRatingType } from '@prisma/client';

export interface ExportFolderFeedback extends Feedback {}
export interface ExportFolderProgress extends Feedback {}
export interface ExportFolderComplete extends Feedback {}
export interface ExportFolderError extends Feedback {}

export interface EtlTag {
    hash: string;
    parentHash: string;
    name: string;
    description: string;
    type: string;
    metaTags: string[];
    contentRating: ContentRatingType;
    contentDescriptors: string[];
}

export interface EtlQuestion {
    hash: string;
    parentHash: string;
    question: string;
    answer: string;
    metaTags: string[];
    distractors: string[];
    learnMore: string;
}
