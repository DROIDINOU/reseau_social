
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from './login.service';
import { CommentModalsService } from './comment-modals.service';
import { UploadService } from './upload.service';
import { UserService } from './user.service';
import { CacheService } from './cache.service';



// Fonction de resolver avec route et state
export const  myResolverResolver: ResolveFn<{ messages: any[], photos: any[], videos: any[] }> = async (route, state) => {
  // Injection des services
  const loginService = inject(LoginService);
  const commentModalsService = inject(CommentModalsService);
  const uploadService = inject(UploadService);
  const userService = inject(UserService);

  try {
    console.time('loadData'); // Démarrer le chronomètre

    // Récupération des données de manière concurrente
    const [messagesResponse, photosResponse, photosFriendsResponse, videosResponse, videosFriendsResponse] = await Promise.all([
      firstValueFrom(loginService.getMessages()),
      firstValueFrom(uploadService.getPhotofilactu()),
      firstValueFrom(loginService.getPhotosFriends()),
      firstValueFrom(uploadService.getVideofilactu()),
      firstValueFrom(loginService.getVideosFriends())
    ]);

    // Traitement des messages
    const messages = Array.isArray(messagesResponse) ? await Promise.all(
      messagesResponse.map(async (message) => {

        const [likesResponse, commentsResponse] = await Promise.all([
          firstValueFrom(loginService.getlikes(message.id)),
          firstValueFrom(commentModalsService.getCommentsByMessage(message.id))
        ]);
        
        return {
          ...message,
          likes: likesResponse.likes,
          comments: commentsResponse,
        };
      })
    ) : [];
    // Traitement des photos
    const combinedPhotos = [...(Array.isArray(photosResponse) ? photosResponse : []), 
                            ...(Array.isArray(photosFriendsResponse) ? photosFriendsResponse : [])];

    const uniquePhotos = Array.from(new Set(combinedPhotos.map(photo => photo.id)))
      .map(id => combinedPhotos.find(photo => photo.id === id));

    const photos = await Promise.all(
      uniquePhotos.map(async (photo) => {
        try {
          const [likesResponse, commentsResponse] = await Promise.all([
            firstValueFrom(loginService.getlikesphotos(photo.id)),
            firstValueFrom(commentModalsService.getCommentsByPhoto(photo.id))
          ]);

          return {
            ...photo,
            likes: likesResponse.likes,
            comments: commentsResponse,
          };
        } catch (error) {
          console.error(`Erreur lors du traitement de la photo ${photo.id}:`, error);
          return {
            ...photo,
            likes: [],
            comments: [],
          };
        }
      })
    );

    // Traitement des vidéos
    const combinedVideos = [...(Array.isArray(videosResponse) ? videosResponse : []), 
                            ...(Array.isArray(videosFriendsResponse) ? videosFriendsResponse : [])];

    const uniqueVideos = Array.from(new Set(combinedVideos.map(video => video.id)))
      .map(id => combinedVideos.find(video => video.id === id));

    const videos = await Promise.all(
      uniqueVideos.map(async (video) => {
        try {
          const [likesResponse, commentsResponse] = await Promise.all([
            firstValueFrom(loginService.getlikesvideos(video.id)),
            firstValueFrom(commentModalsService.getCommentsByVideo(video.id))
          ]);

          return {
            ...video,
            likes: likesResponse.likes,
            comments: commentsResponse,
          };
        } catch (error) {
          console.error(`Erreur lors du traitement de la vidéo ${video.id}:`, error);
          return {
            ...video,
            likes: [],
            comments: [],
          };
        }
      })
    );

    console.log("Messages, photos et vidéos chargés avec succès :", { messages, photos, videos });
    console.timeEnd('loadData'); // Arrêter le chronomètre

    return { messages, photos, videos };
  } catch (error) {
    console.error('Erreur lors du chargement des données', error);
    console.timeEnd('loadData'); // Arrêter le chronomètre en cas d'erreur
    console.log("reultats de resolveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer", { messages: [], photos: [], videos: [] } )
    return { messages: [], photos: [], videos: [] };
  }
};

