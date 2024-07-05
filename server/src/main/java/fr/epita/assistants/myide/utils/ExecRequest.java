package fr.epita.assistants.myide.utils;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class ExecRequest {
    public String feature;
    public List<String> params;
    public String project;
}