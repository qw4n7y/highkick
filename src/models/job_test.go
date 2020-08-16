package models

import "testing"

func TestJobGetRootID(t *testing.T) {
	job := Job{}

	tests := map[string]int32{
		"":      0,
		"1":     1,
		"1/2/3": 1,
	}

	for path, want := range tests {
		job.Path = path
		got, _ := job.GetRootID()
		if got != want {
			t.Errorf("Want %v Got %v", want, got)
		}
	}
}

func TestJobSetParent(t *testing.T) {
	job := Job{}
	parent := Job{ID: 99}

	tests := map[string]string{
		"":      "99",
		"1":     "1/99",
		"1/2/3": "1/2/3/99",
	}

	for path, want := range tests {
		parent.Path = path
		job.SetParent(&parent)
		got := job.Path
		if got != want {
			t.Errorf("Want %v Got %v", want, got)
		}
	}
}
