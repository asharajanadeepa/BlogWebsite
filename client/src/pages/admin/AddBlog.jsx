import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const AddBlog = () => {
  const [image, setImage] = useState(null)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('startup')
  const [isPublished, setIsPublished] = useState(false)
  const [description, setDescription] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    // handle form submission here
    console.log({ image, title, subTitle, category, isPublished, description })
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        <p>Upload thumbnail</p>
        <label htmlFor='image'>
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt='Upload thumbnail'
            className='mt-2 h-16 rounded cursor-pointer'
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type='file'
            id='image'
            hidden
            required
            accept="image/*"
          />
        </label>

        <p className='mt-4'>Blog Title</p>
        <input
          type='text'
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className='mt-4'>Sub Title</p>
        <input
          type='text'
          placeholder='Type here'
          required
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded'
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className='mt-4'>Blog Description</p>
        div

        {/* You can add other inputs like category select, publish checkbox here */}

        <button
          type='submit'
          className='mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition'
        >
          Submit
        </button>
      </div>
    </form>
  )
}

export default AddBlog
