import { drupal } from "@/lib/drupal"
import type { DrupalNode } from "next-drupal"
import { formatDate } from "@/lib/utils" // You'll need to create this helper

export default async function Blog() {
  // Fetch articles from Drupal
  const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: {
        "filter[status]": 1,
        "fields[node--article]": "title,path,field_image,uid,created,body",
        include: "field_image,uid",
        sort: "-created",
      },
      next: {
        revalidate: 0,
      },
    }
  )

  // Transform Drupal nodes to match the post structure
  const posts = nodes?.map((node) => ({
    id: node.id,
    title: node.title,
    href: node.path.alias,
    description: node.body?.processed 
      ? node.body.processed.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...' 
      : '',
    imageUrl: node.field_image?.uri.url 
      ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${node.field_image.uri.url}` 
      : 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
    date: formatDate(node.created), // Implement this helper
    datetime: new Date(node.created).toISOString(),
    category: {
      title: 'Article', // You can fetch taxonomy terms if needed
      href: '#'
    },
    author: {
      name: node.uid?.display_name || 'Anonymous',
      role: 'Author',
      href: '#',
      imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  })) || []

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-4xl text-center font-bold tracking-tight text-pretty text-gray-900 sm:text-5xl">Articles</h2>
          <p className="mt-2 text-lg/8 text-center text-gray-600">Latest articles from our Drupal backend</p>
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {posts.map((post) => (
              <article key={post.id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                <div className="relative aspect-video sm:aspect-2/1 lg:aspect-square lg:w-64 lg:shrink-0">
                  <img
                    alt={post.title}
                    src={post.imageUrl}
                    className="absolute inset-0 size-full rounded-2xl bg-gray-50 object-cover"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                </div>
                <div>
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.datetime} className="text-gray-500">
                      {post.date}
                    </time>
                    <a
                      href={post.category.href}
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                    >
                      {post.category.title}
                    </a>
                  </div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                      <a href={post.href}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-5 text-sm/6 text-gray-600">{post.description}</p>
                  </div>
                  <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                    <div className="relative flex items-center gap-x-4">
                      <img alt="" src={post.author.imageUrl} className="size-10 rounded-full bg-gray-50" />
                      <div className="text-sm/6">
                        <p className="font-semibold text-gray-900">
                          <a href={post.author.href}>
                            <span className="absolute inset-0" />
                            {post.author.name}
                          </a>
                        </p>
                        <p className="text-gray-600">{post.author.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}