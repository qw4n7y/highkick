package ws

type Something interface{}

type PointersList struct {
	items map[*Something]bool
}

func NewPointersList() PointersList {
	return PointersList{
		items: make(map[*Something]bool),
	}
}

func (l *PointersList) Add(item *Something) {
	l.items[item] = true
}

func (l *PointersList) Includes(item *Something) bool {
	_, exist := l.items[item]
	return exist
}

func (l *PointersList) Remove(item *Something) {
	if !l.Includes(item) {
		return
	}
	delete(l.items, item)
}

func (l *PointersList) Items() []*Something {
	items := make([]*Something, len(l.items))
	i := 0
	for client, _ := range l.items {
		items[i] = client
		i++
	}
	return items
}
