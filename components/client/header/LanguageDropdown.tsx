
"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"

const LanguageDropdown = () => {
  const [language, setLanguage] = useState("FR") // Default is French

  useEffect(() => {
    const storedLang = Cookies.get("lang")
    if (storedLang) {
      setLanguage(storedLang.toUpperCase())
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value
    setLanguage(selectedLang)
    Cookies.set("lang", selectedLang.toLowerCase(), { expires: 365 })
    window.location.reload()
  }

  const languages = ["FR", "AR", "EN"]
  const reorderedLanguages = [
    language,
    ...languages.filter((lang) => lang !== language),
  ]

  return (
    <div className="flex items-center gap-2 text-black">
      <select
        value={language}
        onChange={handleChange}
        className="bg-white text-black  rounded px-2 py-1 focus:outline-none"
      >
        {reorderedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageDropdown

