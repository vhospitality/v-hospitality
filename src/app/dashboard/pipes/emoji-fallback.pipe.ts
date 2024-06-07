import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import twemoji from 'twemoji';

@Pipe({
  name: 'emojiFallback',
  standalone: true,
})
export class EmojiFallback implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}

  transform(emoji: string): string | SafeHtml {
    return !emoji || this.supportsEmoji()
      ? emoji
      : this.domSanitizer.bypassSecurityTrustHtml(twemoji.parse(emoji.trim()));
  }

  // Solution: https://stackoverflow.com/questions/45576748/how-can-i-detect-rendering-support-for-emoji-in-javascript
  supportsEmoji() {
    let ctx: any = document.createElement('canvas').getContext('2d');
    ctx.fillText('🙃', -2, 4);
    return ctx.getImageData(0, 0, 1, 1).data[3] > 0;
  }
}
