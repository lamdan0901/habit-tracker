import MainLayout from 'layouts/MainLayout'
export default function Statistics(props) {
  document.title = 'Habits Statistics'

  return (
    <MainLayout
      clockState={props.clockState}
      sidebarOpened={props.sidebarOpened}
      setSidebarOpened={props.setSidebarOpened}>
      <h2>Statistics</h2>
    </MainLayout>
  )
}
