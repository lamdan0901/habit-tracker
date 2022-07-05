import MainLayout from '../../layouts/MainLayout'

export default function Statistics() {
  document.title = 'Statistics'

  return (
    <MainLayout habits={[]} setIsSearching={() => {}} onSetSearchHabits={() => {}}>
      <h2>Statistics</h2>
      <p>Coming soon...</p>
    </MainLayout>
  )
}
