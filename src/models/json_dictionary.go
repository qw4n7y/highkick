package models

// Trying to scan returned value from database failed:
// Getting %!(EXTRA string={"foo": "bar"}, string=

import (
	"bytes"
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

type JSONDictionary map[string]interface{}

func (m JSONDictionary) Value() (driver.Value, error) {
	return json.Marshal(m)
}

func (m JSONDictionary) Scan(v interface{}) error {
	if v == nil {
		return nil
	}
	switch data := v.(type) {
	case string:
		return json.Unmarshal([]byte(data), &m)
	case []byte:
		// fmt.Printf(">>>", string(data), "<<<")
		return json.Unmarshal(data, &m)
	default:
		return fmt.Errorf("cannot scan type %t into JSONDictionary", v)
	}
}

func (a JSONDictionary) Equal(b JSONDictionary) bool {
	aa, _ := json.Marshal(a)
	bb, _ := json.Marshal(b)
	return bytes.Compare(aa, bb) == 0
}
