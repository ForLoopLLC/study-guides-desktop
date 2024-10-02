import { Feedback } from '.';

export interface ExportFileFeedback extends Feedback {}
export interface ExportFileProgress extends Feedback {}
export interface ExportFileComplete extends Feedback {}
export interface ExportFileError extends Feedback {}

export interface ExportFolderFeedback extends Feedback {}
export interface ExportFolderProgress extends Feedback {}
export interface ExportFolderComplete extends Feedback {}
export interface ExportFolderError extends Feedback {}
