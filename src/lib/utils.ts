import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const genderMovieName = (name: string) => {
  switch (name.toLowerCase()) {
    case "action":
      return "Accion";
    case "comedy":
      return "Comedia";
    case "horror":
      return "Terror";
    case "romance":
      return "Romance";
    case "drama":
      return "Drama";
    case "thriller":
      return "Thriller";
    case "animation":
      return "Animacion";
    case "documentary":
      return "Documental";
    case "crime":
      return "Crimen";
    case "mystery":
      return "Misterio";
    case "family":
      return "Familia";
    case "fantasy":
      return "Fantasia";
    case "adventure":
      return "Aventura";
    case "history":
      return "Historia";
    case "music":
      return "Musica";
    case "tv movie":
      return "Pelicula de TV";
    case "science fiction":
      return "Ciencia Ficcion";
    case "western":
      return "Western";
    case "war":
      return "Guerra";
    case "foreign":
      return "Extranjero";
    case "tv series":
      return "Serie de TV";
    default:
      return name;
  }
}
