import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';
import moment from 'moment';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Blog = () => {
    const { id } = useParams();
    const { axios } = useAppContext();

    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const fetchBlogData = async () => {
        try {
            const { data } = await axios.get(`/api/blog/${id}`);
            data.success ? setData(data.blog) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchComments = async () => {
        try {
            const { data } = await axios.post('/api/blog/comments', { blogId: id });
            data.success ? setComments(data.comments) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const addComment = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/blog/add-comment', { blog: id, name, content });
            if (data.success) {
                toast.success(data.message);
                setName('');
                setContent('');
                fetchComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchBlogData();
        fetchComments();
    }, [id]);

    if (!data) return <Loader />;

    return (
        <div className="relative font-sans text-gray-700">
            <img src={assets.gradientBackground} alt="" className="absolute top-0 left-0 w-full h-80 object-cover z-[-1] opacity-40" />
            <Navbar />

            {/* Header */}
            <header className="mt-28 text-center px-4">
                <p className="text-primary font-medium mb-2">Published on {moment(data.createdAt).format('MMMM Do YYYY')}</p>
                <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 max-w-4xl mx-auto">{data.title}</h1>
                <h2 className="text-lg sm:text-xl mt-4 max-w-2xl mx-auto text-gray-600">{data.subTitle}</h2>
                <div className="inline-block mt-6 py-1 px-4 rounded-full bg-primary/10 text-primary border border-primary/30 text-sm font-medium">Michel Brown</div>
            </header>

            {/* Body */}
            <main className="max-w-5xl mx-auto px-4 mt-10">
                <img src={data.image} alt="Blog" className="rounded-2xl w-full shadow-md mb-8" />
                <div className="prose lg:prose-xl mx-auto mb-16" dangerouslySetInnerHTML={{ __html: data.description }} />

                {/* Comments */}
                <section className="mb-16">
                    <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
                    <div className="space-y-6">
                        {comments.map((item, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex gap-4 mb-2 items-center">
                                    <img src={assets.user_icon} alt="User" className="w-10 h-10 object-cover" />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-400">{moment(item.createdAt).fromNow()}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 ml-14">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Add Comment */}
                <section className="mb-20">
                    <h3 className="text-xl font-semibold mb-4">Add Your Comment</h3>
                    <form onSubmit={addComment} className="space-y-4 max-w-lg">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-primary"
                        />
                        <textarea
                            placeholder="Write your comment..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            className="w-full p-3 h-40 border border-gray-300 rounded-lg outline-none focus:border-primary resize-none"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-primary/90 transition duration-200"
                        >
                            Submit
                        </button>
                    </form>
                </section>

                {/* Share Section */}
                <section className="text-center mb-32">
                    <p className="text-lg font-semibold mb-4">Share this article</p>
                    <div className="flex justify-center gap-6">
                        <img src={assets.facebook_icon} alt="Facebook" className="w-10 hover:scale-110 transition" />
                        <img src={assets.twitter_icon} alt="Twitter" className="w-10 hover:scale-110 transition" />
                        <img src={assets.googleplus_icon} alt="Google+" className="w-10 hover:scale-110 transition" />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Blog;
