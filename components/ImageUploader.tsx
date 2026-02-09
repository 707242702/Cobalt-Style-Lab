
import React from 'react';

interface Props {
  onUpload: (base64: string) => void;
}

const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <label className="group relative flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-[#0047AB]/20 rounded-3xl cursor-pointer hover:border-[#0047AB]/50 hover:bg-blue-50 transition-all duration-300">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-10 h-10 text-[#0047AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-700 mb-1">Upload Reference Subject</p>
          <p className="text-sm text-gray-500">Character, Icon, or Portrait (PNG/JPG)</p>
        </div>
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ImageUploader;
