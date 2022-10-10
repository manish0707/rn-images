export interface IPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const PAGE_SIZE = 34;

export const getPhotos = async ({page = 0}: {page: number}) => {
  const queryString = `?_start=${PAGE_SIZE * page}&_limit=${PAGE_SIZE}`;

  const response = await fetch(
    'https://jsonplaceholder.typicode.com/photos' + queryString,
  );
  const data = await response.json();
  return data as IPhoto[];
};
