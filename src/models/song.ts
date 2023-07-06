import { DocumentData } from 'firebase/firestore'

export class Song {
  id = ''
  title = ''
  artist = ''
  genre = ''
  capo = 0
  song_key = ''
  tuning = ''
  duration_seconds = 0
  tab = ''

  constructor(docData: DocumentData | null) {
    if (docData && docData._value) {
      const doc = docData._value
      this.id = doc.doc_id
      this.title = doc.title
      this.artist = doc.artist
      this.genre = doc.genre
      this.capo = doc.capo
      this.song_key = doc.song_key
      this.tuning = doc.tuning
      this.duration_seconds = doc.duration_seconds
      this.tab = doc.tab
    }
  }
}