# PhotoSafe

App allowing you to search people in your photos.
By first identifying someone on a few photos, the AI is able to recognize this someone in other photos.

Components:

- web: Web App used to see your photos, tag people and search for someone
- photos: Nginx server used to host images in folder photos
- postgres: Web Database
- rabbit: Message broker to communicate between web server and workers
- workers:
  - AI service detecting faces on photos
  - [TODO] AI service learning from user-made identifications to recognize people at scale

## Start

```sh
docker-compose up
```

Open http://localhost:3000/ in a web browser

Note that this docker compose is for DEV only.
