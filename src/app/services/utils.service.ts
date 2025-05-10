import { Injectable, signal, WritableSignal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  movedToFolder: WritableSignal<boolean> = signal(false);

  setMovedToFolderStatus(status: boolean): void {
    this.movedToFolder.set(status);
  }

  public randomString(length: number): string {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
    return result;
  }

  public toJsonString(value: any): string {
    return JSON.stringify(value);
  }

  public truncateText(text: string, maxTextLength: number): string {
    if (text.length > maxTextLength) {
      return text.substring(0, maxTextLength) + '...';
    }
    return text;
  }

  public extractQueryFromEndpoint(endpoint: string): string | null {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    return urlParams.get('q');
  }

  public handleScroll(event: Event, callback: () => void): void {
    const target = event.target as HTMLElement;

    if (!(target instanceof HTMLElement)) return;

    if (
      this.isRouterOutletArea(target) &&
      this.isScrollAtBottom(target)
    ) {
      callback();
    }
  }

  private isRouterOutletArea(target: HTMLElement): boolean {
    return target?.classList.contains('router-outlet-area') || false;
  }

  private isScrollAtBottom(target: HTMLElement): boolean {
    return this.calculateScrollRemaining(target) < 1;
  }

  private calculateScrollRemaining(target: HTMLElement): number {
    const scrollPosition = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    return scrollHeight - clientHeight - scrollPosition;
  }
}
