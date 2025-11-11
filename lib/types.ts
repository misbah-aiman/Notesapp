export interface Note {
  _id?: string;
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  in_bin: boolean;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
}