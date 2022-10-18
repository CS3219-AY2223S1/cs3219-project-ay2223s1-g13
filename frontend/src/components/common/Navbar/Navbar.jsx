import './Navbar.css'

import { headers } from './constants'
import { Button } from '@mui/material'

const NavBar = () => {
  return (
    <div className="navbar">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0vh',
          padding: '1%',
        }}
      >
        <div style={{ marginLeft: '1vw' }}>
          <strong
            style={{ fontSize: '1.8rem', cursor: 'pointer' }}
            onClick={() => 'home'}
          >
            CodeUS
          </strong>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {headers.map((header) => {
            return (
              <div className="underLine2 hide_on_responsive">
                <Button
                  variant="label"
                  color="inherit"
                  style={{ fontWeight: '600', color: 'var(--darkgray)' }}
                >
                  {header}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NavBar
