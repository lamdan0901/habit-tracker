import MainLayout from 'layouts/MainLayout'
export default function Statistics(props) {
  document.title = 'Habits Statistics'

  return (
    <MainLayout
      clockState={props.clockState}
      sidebarOpen={props.sidebarOpen}
      setSidebarOpen={props.setSidebarOpen}>
      <h2>Statistics</h2>
    </MainLayout>
  )
}
