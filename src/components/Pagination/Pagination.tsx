import clsx from 'clsx'
import { useMemo } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import './Pagination.scss'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
  className?: string
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageNumbers = useMemo(
    () => [...Array(totalPages)].map((_, index) => index + 1),
    [totalPages],
  )

  const isStartPage = currentPage === 1
  const isEndPage = currentPage === totalPages || totalPages <= 1

  return (
    <div className="pagi__wrapper">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        className={clsx('pagi__btn', isStartPage && 'disabled')}>
        <FaChevronLeft color={!isStartPage ? '#ff7235' : '#999'} />
      </button>

      <nav className="pagi__nav-btns">
        {pageNumbers.map((pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={clsx('pagi__nav-btn', pageNumber === currentPage && 'active')}>
            {pageNumber}
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        className={clsx('pagi__btn', isEndPage && 'disabled')}>
        <FaChevronRight color={!isEndPage ? '#ff7235' : '#999'} />
      </button>
    </div>
  )
}

export default Pagination
