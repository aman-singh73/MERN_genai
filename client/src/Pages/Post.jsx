import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from "../Assets";
import { getRandomPrompt } from "../Utils";
import { Form, Loader } from "../components";

const Post = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [generatingImg, setgeneratingImg] = useState(false);
  const [loading, setloading] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setgeneratingImg(true);
        const response = await fetch('https://genai-smay.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }
  
        const data = await response.json();
        if (data.photo) {
          setForm({ ...form, photo: data.photo });
        } else {
          console.error('Unexpected response format:', data);
          alert('Failed to generate image.');
        }
      } catch (error) {
        console.error('Error generating image:', error);
        if (error.message.includes('Billing hard limit')) {
          alert('Billing limit reached. Please check your account billing status.');
        } else {
          alert('An error occurred while generating the image.');
        }
      } finally {
        setgeneratingImg(false);
      }
    } else {
      alert('Please enter a prompt.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setloading(true);

      try {
        const response = await fetch('https://genai-smay.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }
        await response.json();
        navigate('/');
      } catch (err) {
        alert('Error sharing the post: ' + err.message);
      } finally {
        setloading(false);
      }
    } else {
      alert("Please enter a prompt to generate an image");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section
      className='max-w-7xl mx-auto'
      style={{
        background: 'linear-gradient(135deg, #f3e7e9, #e3eeff)',
        padding: '20px',
        borderRadius: '15px',
      }}
    >
      <div>
        <h1 className='font-extrabold text-[#222328] text-[35px]'>
          <span className="magic"><span className="magic-text">Create </span></span>
        </h1>
        <p className='mt-2 text-[#105e5e] text-[22px] max-w-[500px]'>
          Create imaginative and <span className="magic"><span className="magic-text">visually </span></span> 
          Generate awe-inspiring images with DALL-E AI and share your masterpieces with fellow enthusiasts.
        </p>
      </div>
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <Form
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            handleChange={handleChange}
          />
          <Form
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A photo of a white fur monster standing in a purple room"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className='w-full h-full object-contain'
              />
            ) : (
              <img
                src={preview}
                alt='preview'
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}
            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className='mt-5 flex gap-5 '>
          <button
            type='button'
            onClick={generateImage}
            className='text-white bg-[#1883ad] font-medium rounded-md text-lg w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {generatingImg ? "Generating an image..." : "Generate"}
          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#1e2d31] text-[18px]'>
            Once you have generated the image, if you want, you can share it with others
          </p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#1883ad] font-medium rounded-md text-lg w-full sm:w-auto px-5 py-2.5 text-center'
            disabled={loading}
          >
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Post;
