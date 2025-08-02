"use client"

import { useState } from "react"

const LanguageDropdown = () => {
  const [language, setLanguage] = useState("EN")

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
  }

  return (
    <div className="flex items-center gap-2 text-black">
      <select
        value={language}
        onChange={handleChange}
        className="bg-white text-black  border-black rounded px-2 py-1 focus:outline-none"
      >
        <option value="FR">FR</option>
        <option value="AR">AR</option>
      </select>
    </div>
  )
}

export default LanguageDropdown
