"use client"
import { useState } from 'react';
import { FaLink, FaImage, FaCalendarAlt, FaIndustry, FaUser, FaPlus, FaTrash } from 'react-icons/fa';
import { MdTextFields, MdImage } from 'react-icons/md';

export default function WorksGeneratorPage() {
  const [worksData, setWorksData] = useState({
    slug: '',
    thumbnail: '',
    title: '',
    meta: {
      year: '',
      industry: '',
      client: '',
      services: []
    },
    about: {
      title: '',
      description: '',
      year: '',
      industry: '',
      image: ''
    },
    sections: []
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [copyText, setCopyText] = useState('Copy Code');

  const handleInputChange = (path, value) => {
    const paths = path.split('.');
    setWorksData(prev => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < paths.length - 1; i++) {
        current = current[paths[i]];
      }
      current[paths[paths.length - 1]] = value;
      return newState;
    });
    setValidationErrors(prev => ({ ...prev, [path]: '' }));
  };

  const handleArrayChange = (path, value) => {
    const items = value.split(',').map(item => item.trim());
    handleInputChange(path, items);
  };

  const addSection = (type) => {
    const newSection = {
      type,
      content: type === 'text' ? '' : [],
      ...(type === 'gallery-with-text' && { description: '' })
    };
    setWorksData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (index) => {
    setWorksData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const updateSection = (index, field, value) => {
    setWorksData(prev => {
      const newSections = [...prev.sections];
      newSections[index][field] = field === 'images' ? value.split(',').map(i => i.trim()) : value;
      return { ...prev, sections: newSections };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!worksData.slug) errors.slug = 'Slug is required';
    if (!worksData.thumbnail) errors.thumbnail = 'Thumbnail is required';
    if (!worksData.title) errors.title = 'Title is required';
    if (!worksData.meta.year) errors['meta.year'] = 'Meta year is required';
    if (!worksData.meta.industry) errors['meta.industry'] = 'Meta industry is required';
    if (!worksData.meta.client) errors['meta.client'] = 'Meta client is required';
    if (worksData.meta.services.length === 0) errors['meta.services'] = 'At least one service is required';
    if (!worksData.about.title) errors['about.title'] = 'About title is required';
    if (!worksData.about.description) errors['about.description'] = 'About description is required';
    if (!worksData.about.image) errors['about.image'] = 'About image is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateOutput = () => {
    if (!validateForm()) return;

    const output = {
      slug: worksData.slug,
      thumbnail: worksData.thumbnail,
      title: worksData.title,
      meta: {
        year: worksData.meta.year,
        industry: worksData.meta.industry,
        client: worksData.meta.client,
        services: worksData.meta.services
      },
      about: {
        title: worksData.about.title,
        description: worksData.about.description,
        year: worksData.about.year || worksData.meta.year,
        industry: worksData.about.industry || worksData.meta.industry,
        image: worksData.about.image
      },
      sections: worksData.sections.map(section => ({
        type: section.type,
        ...(section.type === 'text' && { content: section.content }),
        ...(section.type === 'image-grid' && { images: section.content }),
        ...(section.type === 'gallery-with-text' && { 
          description: section.description,
          images: section.content
        })
      }))
    };

    setGeneratedOutput(output);
  };

  const copyToClipboard = () => {
    const code = `export const works = ${JSON.stringify(generatedOutput, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/^{\n/, '{\n')
      .replace(/\n}$/, '\n}')};`;

    navigator.clipboard.writeText(code).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy Code'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900">
            Works <span className="text-blue-600">Template Generator</span>
          </h1>
          <p className="text-gray-600 mt-2">Generate structured works data for portfolio entries</p>
        </div>

        {/* Main Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
          {/* Basic Details */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Works Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FaLink className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  value={worksData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Slug (e.g., webflow)"
                />
                {validationErrors.slug && <p className="text-red-500 text-sm">{validationErrors.slug}</p>}
              </div>
              
              <div className="relative">
                <FaImage className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  type="text"
                  value={worksData.thumbnail}
                  onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Thumbnail URL"
                />
                {validationErrors.thumbnail && <p className="text-red-500 text-sm">{validationErrors.thumbnail}</p>}
              </div>

              <div className="relative">
                <MdTextFields className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  value={worksData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Title"
                />
                {validationErrors.title && <p className="text-red-500 text-sm">{validationErrors.title}</p>}
              </div>
            </div>
          </section>

          {/* Meta Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Meta Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  value={worksData.meta.year}
                  onChange={(e) => handleInputChange('meta.year', e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Year"
                />
                {validationErrors['meta.year'] && <p className="text-red-500 text-sm">{validationErrors['meta.year']}</p>}
              </div>

              <div className="relative">
                <FaIndustry className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  value={worksData.meta.industry}
                  onChange={(e) => handleInputChange('meta.industry', e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Industry"
                />
                {validationErrors['meta.industry'] && <p className="text-red-500 text-sm">{validationErrors['meta.industry']}</p>}
              </div>

              <div className="relative">
                <FaUser className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  value={worksData.meta.client}
                  onChange={(e) => handleInputChange('meta.client', e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="Client Name"
                />
                {validationErrors['meta.client'] && <p className="text-red-500 text-sm">{validationErrors['meta.client']}</p>}
              </div>

              <div className="relative">
                <input
                  value={worksData.meta.services.join(', ')}
                  onChange={(e) => handleArrayChange('meta.services', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Services (comma separated)"
                />
                {validationErrors['meta.services'] && <p className="text-red-500 text-sm">{validationErrors['meta.services']}</p>}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">About Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  value={worksData.about.title}
                  onChange={(e) => handleInputChange('about.title', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="About Title"
                />
                {validationErrors['about.title'] && <p className="text-red-500 text-sm">{validationErrors['about.title']}</p>}
              </div>

              <div className="relative">
                <textarea
                  value={worksData.about.description}
                  onChange={(e) => handleInputChange('about.description', e.target.value)}
                  className="w-full p-3 border rounded-lg h-32"
                  placeholder="About Description"
                />
                {validationErrors['about.description'] && <p className="text-red-500 text-sm">{validationErrors['about.description']}</p>}
              </div>

              <div className="relative">
                <MdImage className="absolute left-3 top-[17px] text-gray-500" />
                <input
                  type="text"
                  value={worksData.about.image}
                  onChange={(e) => handleInputChange('about.image', e.target.value)}
                  className="w-full pl-10 p-3 border rounded-lg"
                  placeholder="About Image URL"
                />
                {validationErrors['about.image'] && <p className="text-red-500 text-sm">{validationErrors['about.image']}</p>}
              </div>
            </div>
          </section>

          {/* Sections */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Content Sections</h2>
              <div className="flex gap-2">
                <button onClick={() => addSection('text')} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg">
                  <FaPlus className="inline mr-2" /> Text
                </button>
                <button onClick={() => addSection('image-grid')} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg">
                  <FaPlus className="inline mr-2" /> Image Grid
                </button>
                <button onClick={() => addSection('gallery-with-text')} className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg">
                  <FaPlus className="inline mr-2" /> Gallery
                </button>
              </div>
            </div>

            {worksData.sections.map((section, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4 relative">
                <button
                  onClick={() => removeSection(index)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500"
                >
                  <FaTrash />
                </button>

                <div className="flex justify-between items-center">
                  <h3 className="font-semibold capitalize">{section.type}</h3>
                </div>

                {section.type === 'text' && (
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                    className="w-full p-3 border rounded-lg h-32"
                    placeholder="Text content"
                  />
                )}

                {(section.type === 'image-grid' || section.type === 'gallery-with-text') && (
                  <>
                    {section.type === 'gallery-with-text' && (
                      <textarea
                        value={section.description}
                        onChange={(e) => updateSection(index, 'description', e.target.value)}
                        className="w-full p-3 border rounded-lg h-32"
                        placeholder="Gallery description"
                      />
                    )}
                    <input
                      type="text"
                      value={section.content.join(', ')}
                      onChange={(e) => updateSection(index, 'images', e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Image URLs (comma separated)"
                    />
                  </>
                )}
              </div>
            ))}
          </section>

          {/* Generate Button */}
          <button
            onClick={generateOutput}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Generate Works Template
          </button>
        </div>

        {/* Output Section */}
        {generatedOutput && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Generated Output</h2>
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {copyText}
              </button>
            </div>
            <pre className="bg-gray-50 p-6 rounded-lg overflow-x-auto">
              <code>
                {JSON.stringify(generatedOutput, null, 2)
                  .replace(/"([^"]+)":/g, '$1:')
                  .replace(/^{\n/, '{\n')
                  .replace(/\n}$/, '\n}')}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}