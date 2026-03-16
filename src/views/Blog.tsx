
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

const Blog = () => {
  const { t } = useLanguage();
  
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Places to Visit in Bosnia and Herzegovina",
      excerpt: "Discover the most beautiful and culturally significant locations across Bosnia and Herzegovina that you simply cannot miss during your visit.",
      date: "May 15, 2024",
      author: "Sarah Johnson",
      category: "Travel"
    },
    {
      id: 2,
      title: "A Guide to Bosnian Cuisine",
      excerpt: "Explore the rich and diverse culinary traditions of Bosnia with our comprehensive guide to local dishes, ingredients, and dining customs.",
      date: "April 28, 2024",
      author: "Emir Hodžić",
      category: "Culture"
    },
    {
      id: 3,
      title: "Driving in Bosnia: Tips and Recommendations",
      excerpt: "Everything you need to know about driving in Bosnia, from road conditions and rules to scenic routes that offer breathtaking views.",
      date: "April 10, 2024",
      author: "Mark Anderson",
      category: "Travel Tips"
    }
  ];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map(post => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  <span>{post.date}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-foreground/80">
                  {post.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-muted-foreground">By {post.author}</span>
                <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                  {post.category}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Blog;
