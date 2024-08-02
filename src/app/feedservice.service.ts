
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedserviceService {
  private messages$ = new BehaviorSubject<any[]>([]);
  private photos$ = new BehaviorSubject<any[]>([]);
  private videos$ = new BehaviorSubject<any[]>([]);

  feed$ = combineLatest([
    this.messages$,
    this.photos$,
    this.videos$
  ]).pipe(
    map(([messages, photos, videos]) => {
      // Combine the messages, photos, and videos arrays
      const combined = [
        ...messages.map(item => ({ ...item, type: 'message' })),
        ...photos.map(item => ({ ...item, type: 'photo' })),
        ...videos.map(item => ({ ...item, type: 'video' }))
      ];

      // Sort combined items based on the desired criteria (e.g., date)
      return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })
  );

  setMessages(messages: any[]) {
    this.messages$.next(messages);
  }

  setPhotos(photos: any[]) {
    this.photos$.next(photos);
  }

  setVideos(videos: any[]) {
    this.videos$.next(videos);
  }
}
