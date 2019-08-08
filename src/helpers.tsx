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
