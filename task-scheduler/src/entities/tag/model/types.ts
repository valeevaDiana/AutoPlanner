export interface Tag {
  id: string;
  name: string;
  color: string; 
  createdAt: string;
}

export interface TagStorage {
  tags: Tag[];
}