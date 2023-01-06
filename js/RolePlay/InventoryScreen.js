class InventoryScreen {
  constructor(config) {
    this.onComplete = config.onComplete;
    this.event = config.event;
    this.element = null;
    this.actionListener = null;
    this.left = null;
    this.right = null;
    this.prevFocus = null;
  }

  useItem = (e) => {
    const itemUsed = e.target.title;
    const inventoryObj = window.playerState.items.find((item) => item.actionId === itemUsed);
    const indexObj = window.playerState.items.findIndex((item) => item.actionId === itemUsed);
    const itemInfo = window.gameContent.items.find((item) => item.actionId === itemUsed);
    const inventoryBtn = Array.from(this.element.querySelectorAll('button[data-button]'));

    utils.itemFunctions[itemInfo.action](itemInfo.type, itemInfo.value);

    if (inventoryObj?.type === 'consumable') {
      // lowering quantity of consumable items
      if (inventoryObj.quantity === 1) {
        window.playerState.items.splice(indexObj, 1);
      }
      if (inventoryObj.quantity > 1) {
        window.playerState.items[indexObj].quantity -= 1;
      }

      if (Number(e.target.innerText) === 1) {
        e.target.remove();
        this.prevFocus -= 1;
        inventoryBtn[this.prevFocus].focus();
        this.hoverItem();
      }
      if (Number(e.target.innerText) > 1) {
        e.target.innerText -= 1;
      }
    }
  };

  hoverItem = () => {
    const inventoryBtn = Array.from(this.element.querySelectorAll('button[data-button]'));
    const itemUsed = inventoryBtn[this.prevFocus].title;
    const hoverDiv = this.element.querySelector('.Inventory_div_info');
    const itemInfo = window.gameContent.items.find((item) => item.actionId === itemUsed);
    hoverDiv.innerHTML = (`
      <p class="Inventory_p_hover_title">${itemInfo.name}</p>
      <img 
        class="Inventory_img_hover" 
        src=/assets/images/items/${itemInfo.image}
      >
      <p class="Inventory_p_hover_details">${itemInfo.details}</p>
    `);
  };

  closeInventory = () => {
    this.element.remove();
    this.actionListener.unbind();
    this.left.unbind();
    this.right.unbind();
    if (this.onComplete) {
      this.onComplete();
    }
  };

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('InventoryElement');

    this.element.innerHTML = (`
        <p class="Inventory_p">Inventário</p>
        <div class="Inventory_div_items">
        ${window.playerState.items.map((el, index) => {
        const itemInfo = window.gameContent.items.find(({ actionId }) => actionId === el.actionId);

        return `
          <button 
            class="Inventory_button" 
            data-button='${index}'
            title=${itemInfo.actionId} 
            style="background-image: url('/assets/images/items/${itemInfo.image}');"
          >
          ${el.quantity ? el.quantity : ''}
          </button>`;
      })
        .join('')}
        </div>
        <div class="Inventory_div_info">
          <p class="Inventory_p_hover_details">
            Passe o mouse em cima dos itens para ver mais informações
          </p>
        </div>
        <button 
          class='Inventory_button_close' 
          data-button='${window.playerState.items.length}'
          title='backButton'
          >
          Ok
        </button>
      `);

    const firstBtn = this.element.querySelector('button');
    const allBtn = Array.from(this.element.querySelectorAll('button'));
    const lastBtn = allBtn[allBtn.length - 1];

    allBtn.forEach((btn) => btn.addEventListener('click', this.useItem));
    allBtn.forEach((btn) => btn.addEventListener('mouseover', (e) => {
      this.prevFocus = Number(e.target.dataset.button);
      btn.focus();
      this.hoverItem();
    }));

    allBtn.pop();

    lastBtn.addEventListener('click', this.closeInventory);

    this.actionListener = new KeyPressListener('Escape', () => {
      this.closeInventory();
    });

    this.left = new KeyPressListener('ArrowLeft', () => {
      const inventoryBtn = Array.from(this.element.querySelectorAll('button[data-button]'));
      const nextButton = Array.from(inventoryBtn).reverse()
        .find((item) => item.dataset.button < this.prevFocus && !item.disabled);
      if (nextButton) {
        nextButton?.focus();
        this.prevFocus -= 1;
        this.hoverItem();
      }
    });

    this.right = new KeyPressListener('ArrowRight', () => {
      const inventoryBtn = Array.from(this.element.querySelectorAll('button[data-button]'));
      const nextButton = Array
        .from(inventoryBtn)
        .find((item) => item.dataset.button > this.prevFocus && !item.disabled);
      if (nextButton) {
        nextButton?.focus();
        this.prevFocus += 1;
        this.hoverItem();
      }
    });

    this.prevFocus = 0;
    this.hoverItem();

    this.actionListener.init();
    this.left.init();
    this.right.init();

    setTimeout(() => {
      firstBtn.focus();
    }, 100);
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
