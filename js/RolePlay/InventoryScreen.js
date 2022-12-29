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

    utils.itemFunctions[itemInfo.action](itemInfo.type, itemInfo.value);

    // lowering quantity of consumable items
    if (inventoryObj.type === 'consumable' && inventoryObj.quantity === 1) {
      window.playerState.items.splice(indexObj, 1);
    }
    if (inventoryObj.type === 'consumable' && inventoryObj.quantity > 1) {
      window.playerState.items[indexObj].quantity -= 1;
    }
    this.closeInventory();
  };

  hoverItem = (e) => {
    const itemUsed = e.target.title;
    const hoverDiv = this.element.querySelector('.Inventory_div_info');
    const itemInfo = window.gameContent.items.find((item) => item.actionId === itemUsed);
    hoverDiv.innerHTML = (`
      <p class="Inventory_p_hover_title">${itemInfo.name}</p>
      <img class="Inventory_img_hover" src=/assets/images/items/${itemInfo.image} title=${itemInfo.actionId}>
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
        ${window.playerState.items.map((item, index) => {
        const itemInfo = window.gameContent.items
          .find((itemStore) => itemStore.actionId === item.actionId);

        if (item.type === 'consumable') {
          return `
            <button
              class="Inventory_button"
              data-button='${index}' 
              title=${itemInfo.actionId}
              style="background-image: url('/assets/images/items/${itemInfo.image}');"
            >
              ${item.quantity}
            </button>
            `;
        }

        return `<button class="Inventory_button" title=${itemInfo.actionId} data-button='${index}'>
          ${itemInfo.name}
        </button>`;
      })
        .join('')}
        </div>
        <div class="Inventory_div_info">
          <p class="Inventory_p_hover_details">
            Passe o mouse em cima dos itens para ver mais informações
          </p>
        </div>
        <button class='Inventory_button_close' data-button='${window.playerState.items.length}'>
          Ok
        </button>
      `);

    const firstBtn = this.element.querySelector('button');
    const allBtn = this.element.querySelectorAll('button');
    const lastBtn = allBtn[allBtn.length - 1];

    allBtn.forEach((btn) => btn.addEventListener('click', this.useItem));
    allBtn.forEach((btn) => btn.addEventListener('mouseover', (e) => {
      console.log(e);
      this.prevFocus = Number(e.target.dataset.button);
      btn.focus();
      this.hoverItem(e);
      console.log('mouseenterx2', this.prevFocus);
    }));

    lastBtn.removeEventListener('click', this.useItem);
    lastBtn.removeEventListener('mouseover', this.hoverItem);
    lastBtn.addEventListener('click', this.closeInventory);

    this.actionListener = new KeyPressListener('Escape', () => {
      this.closeInventory();
    });
    this.actionListener.init();

    this.prevFocus = 0;

    this.left = new KeyPressListener('ArrowLeft', () => {
      const inventoryBtn = Array.from(this.element.querySelectorAll('button[data-button]'));
      inventoryBtn.pop();
      const nextButton = Array
        .from(inventoryBtn).reverse()
        .find((item) => item.dataset.button < this.prevFocus && !item.disabled);
      if (nextButton) {
        nextButton?.focus();
        this.prevFocus -= 1;
      }
      console.log('left', this.prevFocus);
    });

    this.right = new KeyPressListener('ArrowRight', () => {
      const inventoryBtn = Array.from(this.element.querySelectorAll('button[data-button]'));
      inventoryBtn.pop();
      const nextButton = Array
        .from(inventoryBtn)
        .find((item) => item.dataset.button > this.prevFocus && !item.disabled);
      if (nextButton) {
        nextButton?.focus();
        this.prevFocus += 1;
      }
      console.log('right', this.prevFocus);
    });

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
