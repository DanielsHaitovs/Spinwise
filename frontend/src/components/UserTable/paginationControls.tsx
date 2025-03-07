'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

/**
 * Props for the PaginationControls component.
 * @typedef {Object} PaginationProps
 * @property {number} totalPages - The total number of pages.
 */
interface PaginationProps {
  totalPages: number
}

/**
 * PaginationControls component provides pagination controls for navigating through pages.
 * @param {PaginationProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function PaginationControls({ totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  /**
   * Handles the page change.
   * @param {number} newPage - The new page number to navigate to.
   */
  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`)
  }

  return (
    <div className="flex justify-between items-center mt-4">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Next
      </Button>
    </div>
  )
}
