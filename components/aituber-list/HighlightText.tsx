'use client'

interface HighlightTextProps {
  text: string
  searchTerm: string
  className?: string
}

export function HighlightText({ text, searchTerm, className = '' }: HighlightTextProps) {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>
  }

  const searchTermLower = searchTerm.toLowerCase()
  const textLower = text.toLowerCase()
  const startIndex = textLower.indexOf(searchTermLower)

  if (startIndex === -1) {
    return <span className={className}>{text}</span>
  }

  const beforeMatch = text.slice(0, startIndex)
  const match = text.slice(startIndex, startIndex + searchTerm.length)
  const afterMatch = text.slice(startIndex + searchTerm.length)

  return (
    <span className={className}>
      {beforeMatch}
      <mark className="bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 px-0.5 rounded">
        {match}
      </mark>
      {afterMatch.toLowerCase().includes(searchTermLower) ? (
        <HighlightText text={afterMatch} searchTerm={searchTerm} />
      ) : (
        afterMatch
      )}
    </span>
  )
}
