package ws

import "sync"

type Something interface{}

type PointersList struct {
	items map[*Something]bool
	mux   sync.RWMutex
}

func NewPointersList() PointersList {
	return PointersList{
		items: make(map[*Something]bool),
	}
}

func (l *PointersList) Add(item *Something) {
	l.mux.Lock()
	defer l.mux.Unlock()

	l.items[item] = true
}

func (l *PointersList) Includes(item *Something) bool {
	l.mux.RLock()
	defer l.mux.RUnlock()

	_, exist := l.items[item]
	return exist
}

func (l *PointersList) Remove(item *Something) {
	l.mux.Lock()
	defer l.mux.Unlock()

	if !l.Includes(item) {
		return
	}
	delete(l.items, item)
}

func (l *PointersList) Items() []*Something {
	l.mux.RLock()
	defer l.mux.RUnlock()

	items := make([]*Something, len(l.items))
	i := 0
	for client, _ := range l.items {
		items[i] = client
		i++
	}
	return items
}
