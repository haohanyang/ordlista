import * as moment from "moment";

export interface User {
  id: string;
  email: string;
  username: string;
  bio: string;
  avatar: string;
}

export interface Word {
  id: string;
  swedishWord: string;
  category: string;
  audioUrl: string;
  inflections: string;
  translation: string;
  examples: string[];
  createdAt: string;
  lastModifiedAt: string;
  listId: string;
  creatorId: string;
  synonyms: string;
}

export interface WordList {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  wordCount: number;
  createdAt: string;
}

export class WordListGroupNode {
  isHeader: boolean;
  date: moment.Moment;
  lists: WordList[];
  next: WordListGroupNode | null;

  constructor(list: WordList) {
    this.isHeader = false;
    this.date = moment(list.createdAt);
    this.lists = [list];
    this.next = null;
  }

  static dummy() {
    const list: WordListGroupNode = {
      isHeader: true,
      date: moment(),
      lists: [],
      next: null,
    };
    return list;
  }
}
