export type ArchiveEntry = {
  name: string,
  owner: string,
  uploaded: Date,
  path: string,
  tags: string[],
}

function createInstance(i: number): ArchiveEntry {
  return {
    name: 'foo ' + i,
    owner: 'bar ' + i,
    uploaded: new Date(),
    path: 'https://picsum.photos/200',
    tags: ['lorem', 'ipsum', 'fooasdpfoiasdfjpas', 'a', 'bar', 'foo', 'bin', 'bazz'],
  }
}

export function createMany(count: number): ArchiveEntry[] {
  let result = []
  for (let i = 0; i < count; i++) {
    result.push(createInstance(i))
  }
  return result
}

export type Project = {
  id: number,
  title: string,
  description: string,
  imageCount: number,
}

export const generateMockProjects = () => {
  return [
    { id: 0, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 1, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 2, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 3, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 4, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 5, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 6, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 7, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 8, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 9, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
    { id: 10, title: "Hello world", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque, mi id molestie faucibus, eros erat consequat mi, ut accumsan sem nibh vitae augue. Aliquam.", imageCount: 10 },
  ]
}

export type User = {
  username: string,
}
