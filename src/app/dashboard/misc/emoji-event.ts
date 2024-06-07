export class EmojiEvent {
  char!: string;
  label!: string;

  constructor(data: any) {
    Object.assign(this, data);
  }

  static fromArray(emojiArray: any) {
    return new EmojiEvent({ char: emojiArray[0], label: emojiArray[1] });
  }
}
