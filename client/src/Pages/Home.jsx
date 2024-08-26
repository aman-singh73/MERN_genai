import React, { useState, useEffect } from 'react';
import { Loader, Card, Form } from '../components';
import './home.css';

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }
  return (
    <h2 className='mt-5 font-bold text-[#ce4d0c] text-xl uppercase'>{title}</h2>
  );
};

const Home = () => {
  const [loading, setloading] = useState(false);
  const [AllPosts, setAllPosts] = useState(null);
  const [searchtext, setSearchtext] = useState('');
  const [searchedResults, setsearchedResults] = useState(null);
  const [searchTimeout, setsearchTimeout] = useState(null);

  const fetchPosts = async () => {
    setloading(true);
    try {
      const response = await fetch('https://genai-smay.onrender.com/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (error) {
      alert(error);
    } finally {
      setloading(false);
    }
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchtext(e.target.value);

    setsearchTimeout(
      setTimeout(() => {
        const searchResults = AllPosts.filter((item) =>
          item.name.toLowerCase().includes(searchtext.toLowerCase()) ||
          item.prompt.toLowerCase().includes(searchtext.toLowerCase())
        );
        setsearchedResults(searchResults);
      }, 500)
    );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='text-center'>
        <h1 className='font-extrabold text-4xl sm:text-5xl text-teal-800 mb-4'>
          Spotlight
        </h1>
        <p className='text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto'>
          Explore a compilation of creative and visually striking images produced by the DALL-E AI.
        </p>
      </div>
      <div className='mt-8'>
        <Form
          labelName="Search Posts"
          type="text"
          name="text"
          placeholder="Search posts"
          value={searchtext}
          handleChange={handleSearchChange}
          className='bg-white shadow-lg rounded-lg p-4 border border-teal-300'
        />
      </div>
      <div className='mt-8'>
        {loading ? (
          <div className='flex justify-center items-center min-h-[200px]'>
            <Loader />
          </div>
        ) : (
          <>
            {searchtext && (
              <h2 className='font-medium text-gray-800 text-xl mb-4'>
                Showing results for{' '}
                <span className='text-teal-600 font-bold'>{searchtext}</span>
              </h2>
            )}
            <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6'>
              {searchtext ? (
                <RenderCards
                  data={searchedResults}
                  title="No search results could be found"
                />
              ) : (
                <RenderCards
                  data={AllPosts}
                  title="No posts could be found"
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
