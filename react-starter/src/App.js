import React, { Component } from 'react'
import imageHero from './images/hero.png'

export default class App extends Component {
  constructor(props) {
    super(props)
  }
  /**
   * Render
   */

  render() {
    return (
      <div className="container">
        <div className="hero">
          <img src={imageHero} />
        </div>

        <div className="tagline">
          a website built on serverless components and React via the serverless
          framework
        </div>
      </div>
    )
  }
}
