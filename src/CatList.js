import React from 'react'

const CatList = (props) => {
  function listCats() {
    return props.catPics.map(catPic => {
      return (
        <div className="col-lg-12">
          <div className="col-lg-6 col-lg-offset-3 well">
            <img src={catPic.url} className="thumbnail responsive" style={{height: '220px', width: '221px', margin: 'auto'}}/>
          </div>
        </div>
      )
    })
  }
  return (
    <div>
      {listCats()}
    </div>
  )
}

export default CatList
