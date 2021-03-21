import { Component, h, Prop, Element, Event, EventEmitter} from '@stencil/core';
import { AdaptiveCard, HostConfig, Input, Action } from 'adaptivecards';
import * as ACData from 'adaptivecards-templating';
import axios from 'axios';

// Cards && Sample Data
import sampleCard from './assets/exampleCard.json';
import light from './assets/light.json';
import dark from './assets/dark.json';

@Component({
  tag: 'adaptive-card',
  styleUrl: 'adaptivecard.scss',
  shadow: false,
})
export class AdaptiveCardWC {


  // All options, properties blabla
  @Prop() 
  public href?: string;
  
  @Prop() 
  public elementKey?: string;

  @Prop() 
  public mode = 'light';

  @Prop() 
  public template?;

  @Prop() 
  public data?: string | object = {}

  @Prop() 
  public templateId?;

  @Prop() 
  public before?: (data) => void;

  @Prop() 
  public after?: (data) => void;

  @Event() 
  public cardInputChanged: EventEmitter<Input>;

  @Event() 
  public cardSubmit: EventEmitter<Action>;

  // The main element
  @Element() private element: HTMLElement;


  private cardHolder: AdaptiveCard;
  private cardTemplate;
  public htmlResult;

  public loader!: HTMLElement

  private handleCardSubmit(base, action) {

    console.log(base);
    console.log(action);

    // Throw normal event if before+after not set
    if(!base.before && !base.after) {
      base.cardSubmit.emit(action);
    }

    if(base.before) {
      const result = base.before(action);
      if( result ) {
        if(base.afterSubmit) this.after(result);
      }

    }
  }


  private getCard() {
    console.info("AC->Getting Card Configuration")
  }

  private renderCard() {
    // Lets see if we need templating
    let finalCard;
    if(this.data != undefined) {
      // Templating stuff
      const finalCardTemplate = new ACData.Template(this.cardTemplate);
      const dataToUse = {
        $root: this.data
      }
      finalCard = finalCardTemplate.expand(dataToUse);
    } else {
      finalCard = this.cardTemplate;
    }
    // Render the final card
    this.cardHolder.parse(finalCard);
    const cardParsed = this.cardHolder.render();

    // Attach events
    this.cardHolder.onExecuteAction = (action) => { this.handleCardSubmit(this,action); };
    //this.cardHolder.onInputValueChanged = (input) => { this.cardInputChanged.emit(input) };

    // Attach the card to the container
    this.element.innerHTML = "";
    this.element.appendChild(cardParsed);
  }

  componentDidLoad() {

    // Get card data from API
    this.getCard();


    // Initialize adaptive card stuff
    let config: HostConfig;
    if( this.mode == null || this.mode != null && this.mode === 'light') {
      config = new HostConfig(light)
    } else{
      config = new HostConfig(dark)
    }
    this.cardHolder = new AdaptiveCard()
    this.cardHolder.hostConfig = config;

    // Fallback to default card if nothing was passed
    if( !this.href && !this.templateId && !this.template) {
      console.warn('AdaptiveCards-> No Template set please set either href, templateId or template')
      this.cardTemplate = sampleCard;
      this.renderCard();
      this.loader.remove();
      return;
    }

    // Render by template
    if(this.href != null && this.href != "") {
      axios.get(this.href).then(result => {
        this.cardTemplate = result.data.template;
        this.renderCard();
        this.loader.remove();
        return;
      })
    }

    // Render card by cardId (api.madewithcards)

    if(this.templateId != null && this.templateId != '') {
      axios.get(`https://api.madewithcards.io/cards/${this.templateId}`).then(result => {
        this.cardTemplate = result.data.template;
        this.renderCard();
        this.loader.remove();
        return;
      }) 
    }
  }

  // Render the actual card and apply events
  render() {
    return (
      <div ref={(el) => this.loader= el as HTMLElement}>
        <div class="loader">Loading...</div>
      </div>
    );
  }
}
